import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Image, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { MessageCircle, Phone, Video } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import i18n from '@/utils/i18n';

const { width: screenWidth } = Dimensions.get('window');

// Responsive breakpoints
const isSmallDevice = screenWidth < 375;
const isMediumDevice = screenWidth >= 375 && screenWidth < 414;
const isLargeDevice = screenWidth >= 414 && screenWidth < 768;
const isTablet = screenWidth >= 768;

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
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });

    return () => subscription?.remove();
  }, []);

  const handleConversationPress = (conversationId: string) => {
    router.push(`/messages/${conversationId}`);
  };

  const styles = createStyles(dimensions);

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
          numberOfLines={isTablet ? 3 : 2}
        >
          {conversation.lastMessage}
        </Text>
      </View>

      <View style={styles.conversationActions}>
        {conversation.unread && <View style={styles.unreadDot} />}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton}>
            <Phone size={isTablet ? 22 : 18} color={Colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Video size={isTablet ? 22 : 18} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{i18n.t('messages')}</Text>
        <TouchableOpacity style={styles.newMessageButton}>
          <MessageCircle size={isTablet ? 24 : 20} color={Colors.primary} />
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
          <MessageCircle size={isTablet ? 80 : 64} color={Colors.textLight} />
          <Text style={styles.emptyStateTitle}>No messages yet</Text>
          <Text style={styles.emptyStateDescription}>
            Start a conversation by applying to jobs or posting your own
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const createStyles = (dimensions: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: isTablet ? 32 : 20,
    paddingTop: isTablet ? 24 : 16,
    paddingBottom: isTablet ? 28 : 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  title: {
    fontSize: isTablet ? 28 : isLargeDevice ? 24 : isSmallDevice ? 20 : 22,
    fontWeight: 'bold',
    color: Colors.text,
  },
  newMessageButton: {
    padding: isTablet ? 12 : 8,
  },
  conversationsList: {
    flex: 1,
  },
  conversationItem: {
    flexDirection: 'row',
    paddingHorizontal: isTablet ? 32 : 20,
    paddingVertical: isTablet ? 20 : 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    alignItems: 'flex-start',
  },
  avatar: {
    width: isTablet ? 64 : 50,
    height: isTablet ? 64 : 50,
    borderRadius: isTablet ? 32 : 25,
    marginRight: isTablet ? 16 : 12,
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: isTablet ? 6 : 4,
  },
  participantName: {
    fontSize: isTablet ? 18 : 16,
    fontWeight: '600',
    color: Colors.text,
  },
  timestamp: {
    fontSize: isTablet ? 14 : 12,
    color: Colors.textSecondary,
  },
  jobTitle: {
    fontSize: isTablet ? 14 : 12,
    color: Colors.primary,
    fontWeight: '500',
    marginBottom: isTablet ? 6 : 4,
  },
  lastMessage: {
    fontSize: isTablet ? 16 : 14,
    color: Colors.textSecondary,
    lineHeight: isTablet ? 22 : 18,
  },
  unreadMessage: {
    color: Colors.text,
    fontWeight: '500',
  },
  conversationActions: {
    alignItems: 'flex-end',
    gap: isTablet ? 12 : 8,
  },
  unreadDot: {
    width: isTablet ? 10 : 8,
    height: isTablet ? 10 : 8,
    borderRadius: isTablet ? 5 : 4,
    backgroundColor: Colors.primary,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: isTablet ? 12 : 8,
  },
  actionButton: {
    padding: isTablet ? 8 : 6,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: isTablet ? 60 : 40,
  },
  emptyStateTitle: {
    fontSize: isTablet ? 22 : 18,
    fontWeight: '600',
    color: Colors.text,
    marginTop: isTablet ? 24 : 16,
    marginBottom: isTablet ? 12 : 8,
  },
  emptyStateDescription: {
    fontSize: isTablet ? 16 : 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: isTablet ? 24 : 20,
  },
});