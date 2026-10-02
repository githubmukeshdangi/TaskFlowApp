import React, { useState } from "react";
import { View, Text, Pressable, Alert, ScrollView, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import Papa from "papaparse";
import moment from "moment";
import styles from "./bulkUploadScreen.style";
import { getTasks, saveTasks } from "../../storage/taskStorage";
import { Task } from "../addEditTask/addEditTaskProps";
import { useTheme } from "../../context/ThemeContext";


const BulkUploadScreen = () => {
  const [selectedFile, setSelectedFile] =
    useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [validTasks, setValidTasks] = useState<CSVTask[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [importedCount, setImportedCount] = useState(0);
  const [isValidated, setIsValidated] = useState(false);
  const [importCompleted, setImportCompleted] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [duplicateCount, setDuplicateCount] = useState(0);
    const { colors, isDark } = useTheme();
  

  const handleSelectFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["text/csv", "text/comma-separated-values"],
        copyToCacheDirectory: true,
        multiple: false,
      });
      if (!result.canceled && result.assets.length > 0) {
        const file = result.assets[0];
        if (!file.name.toLowerCase().endsWith(".csv")) {
          Alert.alert("Invalid File", "Please select a CSV file.");
          return;
        }
        setSelectedFile(file);
        setValidTasks([]);
        setErrors([]);
        setTotalRows(0);
        setImportedCount(0);
        setIsValidated(false);
        setImportCompleted(false);
      }
    } catch (error) {
      Alert.alert("Error", "Unable to select file.");
    }
  };

  const validateCSV = (rows: CSVTask[]) => {
    const valid: CSVTask[] = [];
    const invalid: string[] = [];
    rows.forEach((row, index) => {
      const rowNumber = index + 2;
      const title = row.title?.trim();
      const description = row.description?.trim() || "";
      const category = row.category?.trim();
      const priority = row.priority?.trim().toLowerCase();
      const startDate = row.startDate?.trim();
      const dueDate = row.dueDate?.trim();
      const status = row.status?.trim().toLowerCase();
      const rowErrors: string[] = [];

      if (!title) rowErrors.push("Title is required");
      if (!category) rowErrors.push("Category is required");
      if (!["low", "medium", "high"].includes(priority)) {
        rowErrors.push("Invalid priority");
      }
      if (!["pending", "completed"].includes(status)) {
        rowErrors.push("Invalid status");
      }

      const validStart = moment(startDate, "YYYY-MM-DD", true).isValid();
      const validDue = moment(dueDate, "YYYY-MM-DD", true).isValid();
      if (!validStart) rowErrors.push("Invalid startDate");
      if (!validDue) rowErrors.push("Invalid dueDate");

      if (
        validStart &&
        validDue &&
        moment(dueDate).isBefore(moment(startDate), "day")
      ) {
        rowErrors.push("Due date cannot be before start date");
      }

      if (rowErrors.length > 0) {
        invalid.push(`Row ${rowNumber}: ${rowErrors.join(", ")}`);
      } else {
        valid.push({
          title,
          description,
          category,
          priority,
          startDate,
          dueDate,
          status,
        });
      }
    });

    return { valid, invalid };
  };

  const handleValidateCSV = async () => {
    if (!selectedFile) {
      Alert.alert("No File Selected", "Please select a CSV file first.");
      return;
    }
    try {
      const response = await fetch(selectedFile.uri);
      const csvText = await response.text();
      const parsed = Papa.parse<CSVTask>(csvText, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header) => header.trim(),
      });

      if (parsed.errors.length > 0) {
        Alert.alert("CSV Error", parsed.errors[0].message);
        return;
      }

      const requiredHeaders = [
        "title",
        "description",
        "category",
        "priority",
        "startDate",
        "dueDate",
        "status",
      ];

      const headers = Object.keys(parsed.data[0] || {});
      const missingHeaders = requiredHeaders.filter(
        (header) => !headers.includes(header),
      );

      if (missingHeaders.length > 0) {
        Alert.alert(
          "Invalid CSV",
          `Missing columns: ${missingHeaders.join(", ")}`,
        );
        return;
      }

      if (parsed.data.length === 0) {
        Alert.alert("Empty CSV", "The selected CSV has no task rows.");
        return;
      }

      const result = validateCSV(parsed.data);
      setTotalRows(parsed.data.length);
      setValidTasks(result.valid);
      setErrors(result.invalid);
      setIsValidated(true);
      setImportCompleted(false);
      setImportedCount(0);
    } catch (error) {
      Alert.alert("Error", "Unable to read CSV file.");
    }
  };

  const handleSaveTasks = async () => {
    if (!isValidated || validTasks.length === 0) {
      Alert.alert(
        "No Valid Tasks",
        "Please validate a CSV with valid tasks first.",
      );
      return;
    }
    try {
      setIsImporting(true);

      const existingTasks = await getTasks();
      const createTaskKey = (task: {
        title: string;
        category: string;
        startDate: string;
        dueDate: string;
      }) =>
        [
          task.title.trim().toLowerCase(),
          task.category.trim().toLowerCase(),
          task.startDate,
          task.dueDate,
        ].join("|");

      const existingKeys = new Set(existingTasks.map(createTaskKey));
      const importedKeys = new Set<string>();
      const uniqueRows = validTasks.filter((task) => {
        const key = createTaskKey(task);

        if (existingKeys.has(key) || importedKeys.has(key)) {
          return false;
        }

        importedKeys.add(key);
        return true;
      });

      const skippedCount = validTasks.length - uniqueRows.length;
      const now = new Date().toISOString();
      const newTasks: Task[] = uniqueRows.map((item, index) => ({
        id: `${Date.now()}-${index}-${Math.random().toString(36).slice(2, 9)}`,
        title: item.title,
        description: item.description,
        category: item.category,
        priority: item.priority as Task["priority"],
        startDate: item.startDate,
        dueDate: item.dueDate,
        status: item.status as Task["status"],
        createdAt: now,
        updatedAt: now,
      }));

      await saveTasks([...newTasks, ...existingTasks]);
      setImportedCount(newTasks.length);
      setDuplicateCount(skippedCount);
      setImportCompleted(true);

      Alert.alert(
        "Import Completed",
        `Total Rows: ${totalRows}\nImported: ${newTasks.length}\nInvalid: ${errors.length}\nDuplicates Skipped: ${skippedCount}`,
      );
    } catch (error) {
      Alert.alert("Import Error", "Unable to save tasks. Please try again.");
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <ScrollView
  style={[styles.container, { backgroundColor: colors.background }]}
  contentContainerStyle={styles.content}
>
  <Text style={[styles.title, { color: colors.text }]}>Bulk Upload</Text>
  <Text style={[styles.subtitle, { color: colors.secondaryText }]}>
    Import multiple tasks using a CSV file.
  </Text>
  <Pressable
    style={[
      styles.uploadArea,
      {
        backgroundColor: colors.card,
        borderColor: colors.border,
      },
    ]}
    onPress={handleSelectFile}
  >
    <Ionicons name="cloud-upload-outline" size={42} color={colors.primary} />
    <Text style={[styles.uploadTitle, { color: colors.text }]}>Select CSV File</Text>
    <Text style={[styles.uploadSubtitle, { color: colors.secondaryText }]}>
      Tap here to browse your files
    </Text>
  </Pressable>
  {selectedFile && (
    <View style={[styles.fileCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Ionicons name="document-text-outline" size={24} color={colors.primary} />
      <View style={styles.fileInfo}>
        <Text style={[styles.fileName, { color: colors.text }]} numberOfLines={1}>
          {selectedFile.name}
        </Text>
        <Text style={[styles.fileStatus, { color: colors.secondaryText }]}>File selected</Text>
      </View>
      <Pressable
        onPress={() => {
          setSelectedFile(null);
          setValidTasks([]);
          setErrors([]);
          setTotalRows(0);
          setImportedCount(0);
          setIsValidated(false);
          setImportCompleted(false);
        }}
      >
        <Ionicons name="close-circle-outline" size={23} color={colors.secondaryText} />
      </Pressable>
    </View>
  )}
  <Pressable
    style={[styles.importButton, { backgroundColor: colors.primary }]}
    onPress={handleValidateCSV}
  >
    <Text style={styles.importButtonText}>Validate CSV</Text>
  </Pressable>
  {isValidated && (
    <View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[styles.infoText, { color: colors.text }]}>Total Rows: {totalRows}</Text>
      <Text style={[styles.infoText, { color: colors.text }]}>Valid Rows: {validTasks.length}</Text>
      <Text style={[styles.infoText, { color: colors.text }]}>Invalid Rows: {errors.length}</Text>
    </View>
  )}
  {validTasks.length > 0 && (
    <View style={[styles.importCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={{ fontWeight: '700', color: colors.text }}>
        Task Preview
      </Text>
      {validTasks.map((task, index) => (
        <View key={index} style={{ marginTop: 12 }}>
          <Text style={{ fontWeight: '600', color: colors.text }}>
            {index + 1}. {task.title}
          </Text>
          <Text style={[styles.infoText, { color: colors.secondaryText }]}>
            {task.category} | {task.priority} | {task.status}
          </Text>
          <Text style={[styles.infoText, { color: colors.secondaryText }]}>
            {task.startDate} to {task.dueDate}
          </Text>
        </View>
      ))}
    </View>
  )}
  {errors.length > 0 && (
    <View style={[styles.importCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={{ fontWeight: '700', color: colors.danger }}>
        Validation Errors
      </Text>
      {errors.map((error, index) => (
        <Text key={index} style={{ color: colors.danger, marginTop: 8 }}>
          {error}
        </Text>
      ))}
    </View>
  )}
  {isValidated && validTasks.length > 0 && !importCompleted && (
    <Pressable
      style={[styles.importButton, { backgroundColor: colors.primary }]}
      onPress={handleSaveTasks}
      disabled={isImporting}
    >
      <Text style={styles.importButtonText}>
        {isImporting ? 'Importing...' : 'Import Tasks'}
      </Text>
    </Pressable>
  )}
  {importCompleted && (
    <View style={[styles.importCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={{ color: '#16A34A', fontWeight: '700' }}>
        Import Completed Successfully!
      </Text>
      <View>
        <Text style={[styles.infoText, { color: colors.text }]}>
          Successfully Imported: {importedCount}
        </Text>
        <Text style={[styles.infoText, { color: colors.text }]}>
          Invalid Rows: {errors.length}
        </Text>
        <Text style={[styles.infoText, { color: colors.text }]}>
          Duplicates Skipped: {duplicateCount}
        </Text>
      </View>
    </View>
  )}
</ScrollView>
  );
};

export default BulkUploadScreen;
