import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Send, Phone, Video, MoveVertical as MoreVertical, Paperclip, Camera } from 'lucide-react-native';
import Colors from '@/constants/Colors';

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'image';
  imageUrl?: string;
}

const mockMessages: Message[] = [
  {
    id: '1',
    senderId: 'client1',
    content: 'Hi! I saw your profile and I think you\'d be perfect for my plumbing job.',
    timestamp: new Date(Date.now() - 3600000),
    type: 'text'
  },
  {
    id: '2',
    senderId: 'worker1',
    content: 'Thank you for reaching out! I\'d be happy to help. Can you tell me more about the issue?',
    timestamp: new Date(Date.now() - 3500000),
    type: 'text'
  },
  {
    id: '3',
    senderId: 'client1',
    content: 'The kitchen sink is leaking and water is getting under the cabinet. Here\'s a photo:',
    timestamp: new Date(Date.now() - 3400000),
    type: 'text'
  },
  {
    id: '4',
    senderId: 'client1',
    content: '',
    timestamp: new Date(Date.now() - 3300000),
    type: 'image',
    imageUrl: 'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '5',
    senderId: 'worker1',
    content: 'I can see the problem. This looks like a pipe joint issue. I can fix this for you. When would be a good time?',
    timestamp: new Date(Date.now() - 3200000),
    type: 'text'
  },
  {
    id: '6',
    senderId: 'client1',
    content: 'How about tomorrow morning around 9 AM?',
    timestamp: new Date(Date.now() - 3100000),
    type: 'text'
  },
  {
    id: '7',
    senderId: 'worker1',
    content: 'Perfect! I\'ll be there at 9 AM sharp. My rate is $50/hour and this should take about 2-3 hours.',
    timestamp: new Date(Date.now() - 3000000),
    type: 'text'
  }
];

const mockParticipant = {
  id: 'client1',
  name: 'Ahmad Hassan',
  avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200',
  online: true
};

// Mock current user for message identification
const mockCurrentUser = {
  id: 'worker1',
  name: 'Current User'
};

export default function ChatScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    // Scroll to bottom when messages change
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const sendMessage = () => {
    if (newMessage.trim() === '') return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: mockCurrentUser.id,
      content: newMessage.trim(),
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const isMyMessage = (senderId: string) => {
    return senderId === mockCurrentUser.id || senderId === 'worker1'; // Mock current user
  };

  const MessageBubble = ({ message }: { message: Message }) => {
    const isMine = isMyMessage(message.senderId);
    
    return (
      <View style={[styles.messageContainer, isMine ? styles.myMessage : styles.theirMessage]}>
        {message.type === 'image' && message.imageUrl ? (
          <View style={styles.imageMessageContainer}>
            <Image source={{ uri: message.imageUrl }} style={styles.messageImage} />
          </View>
        ) : (
          <Text style={[styles.messageText, isMine ? styles.myMessageText : styles.theirMessageText]}>
            {message.content}
          </Text>
        )}
        <Text style={[styles.messageTime, isMine ? styles.myMessageTime : styles.theirMessageTime]}>
          {formatTime(message.timestamp)}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={Colors.text} />
          </TouchableOpacity>
          <Image source={{ uri: mockParticipant.avatar }} style={styles.participantAvatar} />
          <View style={styles.participantInfo}>
            <Text style={styles.participantName}>{mockParticipant.name}</Text>
            <Text style={styles.participantStatus}>
              {mockParticipant.online ? 'Online' : 'Last seen recently'}
            </Text>
          </View>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerAction}>
            <Phone size={20} color={Colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerAction}>
            <Video size={20} color={Colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerAction}>
            <MoreVertical size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Messages */}
      <KeyboardAvoidingView 
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
        </ScrollView>

        {/* Input */}
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.attachButton}>
            <Paperclip size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.cameraButton}>
            <Camera size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
          <TextInput
            style={styles.textInput}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Type a message..."
            multiline
            maxLength={1000}
          />
          <TouchableOpacity 
            style={[styles.sendButton, newMessage.trim() && styles.sendButtonActive]}
            onPress={sendMessage}
            disabled={!newMessage.trim()}
          >
            <Send size={20} color={newMessage.trim() ? Colors.white : Colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  participantAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  participantInfo: {
    flex: 1,
  },
  participantName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  participantStatus: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerAction: {
    padding: 8,
  },
  chatContainer: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  messageContainer: {
    maxWidth: '80%',
    marginVertical: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
  },
  theirMessage: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.white,
    borderBottomLeftRadius: 4,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  myMessageText: {
    color: Colors.white,
  },
  theirMessageText: {
    color: Colors.text,
  },
  messageTime: {
    fontSize: 11,
    marginTop: 4,
  },
  myMessageTime: {
    color: Colors.white,
    opacity: 0.8,
    textAlign: 'right',
  },
  theirMessageTime: {
    color: Colors.textSecondary,
  },
  imageMessageContainer: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  messageImage: {
    width: 200,
    height: 150,
    borderRadius: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    gap: 8,
  },
  attachButton: {
    padding: 8,
  },
  cameraButton: {
    padding: 8,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
    fontSize: 16,
    backgroundColor: Colors.backgroundSecondary,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.backgroundSecondary,
  },
  sendButtonActive: {
    backgroundColor: Colors.primary,
  },
});