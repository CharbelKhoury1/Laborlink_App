import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { MessageCircle, Phone, Video } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useAuthState } from '@/hooks/useAuth';
import i18n from '@/utils/i18n';

// Mock conversations data
const mockConversations = [
  {
    id: '1',
    participantName: 'Ahmad Hassan',
    participantType: 'client',
    lastMessage: 'The plumbing job is completed. Please review and rate.',
    timestamp: '2 min ago',
    unread: true,
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150',
    jobTitle: 'Kitchen Plumbing Repair'
  },
  {
    id: '2',
    participantName: 'Layla Khoury',
    participantType: 'client',
    lastMessage: 'Can you start the garden work tomorrow at 9 AM?',
    timestamp: '1 hour ago',
    unread: false,
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150',
    jobTitle: 'Garden Maintenance'
  },
  {
    id: '3',
    participantName: 'Omar Farid',
    participantType: 'worker',
    lastMessage: 'I have 5 years experience in electrical work.',
    timestamp: '3 hours ago',
    unread: true,
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150',
    jobTitle: 'Electrical Wiring Installation'
  },
  {
    id: '4',
    participantName: 'Fatima Saleh',
    participantType: 'client',
    lastMessage: 'Thank you for the excellent cleaning service!',
    timestamp: '1 day ago',
    unread: false,
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150',
    jobTitle: 'House Cleaning'
  }
];

export default function MessagesScreen() {
  const router = useRouter();
  const { user } = useAuthState();

  const handleConversationPress = (conversationId: string) => {
    router.push(`/messages/${conversationId}`);
  };

  const ConversationItem = ({ conversation }: { conversation: any }) => (
    <TouchableOpacity 
      style={styles.conversationItem}
      onPress={() => handleConversationPress(conversation.id)}
    >
      <Image source={{ uri: conversation.avatar }} style={styles.avatar} />
      
      <View style={styles.conversationContent}>
        <View style={styles.conversationHeader}>
          <Text style={styles.participantName}>{conversation.participantName}</Text>
          <Text style={styles.timestamp}>{conversation.timestamp}</Text>
        </View>
        
        <Text style={styles.jobTitle} numberOfLines={1}>
          {conversation.jobTitle}
        </Text>
        
        <Text 
          style={[
            styles.lastMessage, 
            conversation.unread && styles.unreadMessage
          ]} 
          numberOfLines={2}
        >
          {conversation.lastMessage}
        </Text>
      </View>

      <View style={styles.conversationActions}>
        {conversation.unread && <View style={styles.unreadDot} />}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton}>
            <Phone size={18} color={Colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Video size={18} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{i18n.t('messages')}</Text>
        <TouchableOpacity style={styles.newMessageButton}>
          <MessageCircle size={20} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {mockConversations.length > 0 ? (
        <ScrollView style={styles.conversationsList} showsVerticalScrollIndicator={false}>
          {mockConversations.map((conversation) => (
            <ConversationItem key={conversation.id} conversation={conversation} />
          ))}
        </ScrollView>
      ) : (
        <View style={styles.emptyState}>
          <MessageCircle size={64} color={Colors.textLight} />
          <Text style={styles.emptyStateTitle}>No messages yet</Text>
          <Text style={styles.emptyStateDescription}>
            Start a conversation by applying to jobs or posting your own
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
  },
  newMessageButton: {
    padding: 8,
  },
  conversationsList: {
    flex: 1,
  },
  conversationItem: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    alignItems: 'flex-start',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  participantName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  timestamp: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  jobTitle: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500',
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  unreadMessage: {
    color: Colors.text,
    fontWeight: '500',
  },
  conversationActions: {
    alignItems: 'flex-end',
    gap: 8,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 6,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});