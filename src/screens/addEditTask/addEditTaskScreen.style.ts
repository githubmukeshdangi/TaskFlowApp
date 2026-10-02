
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 26,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
  },

  subHeading: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 7,
    lineHeight: 21,
  },
  formGroup: {
    marginBottom: 22,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 10,
  },
  required: {
    color: '#DC2626',
  },
  input: {
    minHeight: 52,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 14,
    color: '#0F172A',
  },

  textArea: {
    height: 115,
    paddingTop: 14,
  },
  inputError: {
    borderColor: '#DC2626',
  },
  errorText: {
    fontSize: 12,
    color: '#DC2626',
    marginTop: 6,
  },
  optionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  optionButton: {
    paddingHorizontal: 17,
    paddingVertical: 11,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  selectedOption: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },
  optionText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  selectedOptionText: {
    color: '#2563EB',
    fontWeight: '700',
  },

  dateInputContainer: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
  },
  dateInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  cancelButton: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },

  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  saveButton: {
    flex: 1.5,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default styles;