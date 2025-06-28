import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AlertCircle, X } from 'lucide-react-native';
import Colors from '@/constants/Colors';

interface InlineErrorProps {
  message: string;
  onDismiss?: () => void;
  style?: any;
}

const InlineError: React.FC<InlineErrorProps> = ({
  message,
  onDismiss,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.content}>
        <AlertCircle size={16} color={Colors.error} />
        <Text style={styles.message}>{message}</Text>
      </View>
      {onDismiss && (
        <TouchableOpacity onPress={onDismiss} style={styles.dismissButton}>
          <X size={16} color={Colors.error} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.backgroundSecondary,
    borderLeftWidth: 4,
    borderLeftColor: Colors.error,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
    marginVertical: 4,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  message: {
    fontSize: 14,
    color: Colors.error,
    flex: 1,
    fontWeight: '500',
  },
  dismissButton: {
    padding: 4,
    marginLeft: 8,
  },
});

export default InlineError;