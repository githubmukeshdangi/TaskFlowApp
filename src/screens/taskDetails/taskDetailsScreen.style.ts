import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 20,
    paddingBottom: 35,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  headerTitle: {
    fontSize: 23,
    fontWeight: '700',
    color: '#1E293B',
  },
  statusBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderTopRightRadius: 16,
     position: 'absolute',
    top: 0,
    right: 0,
  },
  completedBadge: {
    backgroundColor: '#DCFCE7',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#D97706',
  },
  completedText: {
    color: '#15803D',
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    lineHeight: 28,
  },
  description: {
    fontSize: 14,
    color: '#334155',
    lineHeight: 22,
  },
  value: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1E293B',
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 17,
  },
  priorityBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 7,
    backgroundColor: '#F1F5F9',
  },
  highPriority: {
    backgroundColor: '#FEE2E2',
  },
  mediumPriority: {
    backgroundColor: '#FEF3C7',
  },
  lowPriority: {
    backgroundColor: '#DCFCE7',
  },
  priorityText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
  },
  editButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 15,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    gap: 8,
  },
  editButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  completeButton: {
  backgroundColor: '#16A34A',
  paddingVertical: 15,
  borderRadius: 12,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: 22,
  gap: 8,
},
completeButtonText: {
  fontSize: 15,
  fontWeight: '700',
  color: '#FFFFFF',
},
  deleteButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FECACA',
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    gap: 8,
  },
  deleteButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#DC2626',
  },
  notFoundText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#475569',
    marginTop: 12,
  },
  backButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 20,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default styles;