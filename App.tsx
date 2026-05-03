import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Filter } from 'bad-words';

/**
 * The filter keeps a blocklist of words and compares the student comment against it.
 * isProfane() answers "does this text contain any blocked word?"
 * clean() returns the same text but with those words replaced by asterisks so you can
 * preview a safer version without posting the original wording.
 */
const commentFilter = new Filter({ placeHolder: '*' });

type CheckOutcome = 'idle' | 'clean' | 'profane';

export default function App() {
  const [comment, setComment] = useState('');
  const [outcome, setOutcome] = useState<CheckOutcome>('idle');
  const [cleanedVersion, setCleanedVersion] = useState('');

  const onCommentChange = (text: string) => {
    setComment(text);
    setOutcome('idle');
    setCleanedVersion('');
  };

  const handleCheckComment = () => {
    const text = comment.trim();
    const hasProfanity = commentFilter.isProfane(text);

    if (hasProfanity) {
      setOutcome('profane');
      setCleanedVersion(commentFilter.clean(text));
    } else {
      setOutcome('clean');
      setCleanedVersion('');
    }
  };

  const handleSubmitComment = () => {
    if (outcome !== 'clean') return;
    Alert.alert('Submitted', 'Your comment was sent successfully.');
  };

  const canSubmit = outcome === 'clean';

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>STEMM Lab Comment Safety Filter</Text>
          <Text style={styles.subtitle}>Activity: Reaction Board Challenge</Text>
        </View>

        <Text style={styles.label}>Your reflection or comment</Text>
        <TextInput
          style={styles.input}
          value={comment}
          onChangeText={onCommentChange}
          placeholder="Type your reflection here..."
          placeholderTextColor="#9e9e9e"
          multiline
          textAlignVertical="top"
        />

        <Pressable
          style={({ pressed }) => [
            styles.primaryButton,
            pressed && styles.primaryButtonPressed,
          ]}
          onPress={handleCheckComment}
        >
          <Text style={styles.primaryButtonText}>Check Comment</Text>
        </Pressable>

        {outcome === 'clean' && (
          <View style={styles.resultBoxSafe}>
            <Text style={styles.resultTextSafe}>Comment is safe to submit.</Text>
          </View>
        )}

        {outcome === 'profane' && (
          <View style={styles.resultBoxUnsafe}>
            <Text style={styles.resultTextUnsafe}>Inappropriate language detected</Text>
            <Text style={styles.cleanedLabel}>Cleaned Version</Text>
            <Text style={styles.cleanedText}>{cleanedVersion}</Text>
          </View>
        )}

        <Pressable
          style={({ pressed }) => [
            styles.submitButton,
            !canSubmit && styles.submitButtonDisabled,
            canSubmit && pressed && styles.submitButtonPressed,
          ]}
          onPress={handleSubmitComment}
          disabled={!canSubmit}
        >
          <Text
            style={[styles.submitButtonText, !canSubmit && styles.submitButtonTextDisabled]}
          >
            Submit Comment
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f5f7fb',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a237e',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#3949ab',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#37474f',
    marginBottom: 8,
  },
  input: {
    minHeight: 140,
    borderWidth: 1,
    borderColor: '#cfd8dc',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  primaryButton: {
    backgroundColor: '#3949ab',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  primaryButtonPressed: {
    opacity: 0.9,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  resultBoxSafe: {
    backgroundColor: '#e8f5e9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#a5d6a7',
  },
  resultTextSafe: {
    color: '#1b5e20',
    fontSize: 16,
    fontWeight: '600',
  },
  resultBoxUnsafe: {
    backgroundColor: '#ffebee',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ef9a9a',
  },
  resultTextUnsafe: {
    color: '#b71c1c',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  cleanedLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#c62828',
    marginBottom: 6,
  },
  cleanedText: {
    fontSize: 15,
    color: '#424242',
    lineHeight: 22,
  },
  submitButton: {
    backgroundColor: '#00897b',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#bdbdbd',
  },
  submitButtonPressed: {
    opacity: 0.92,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  submitButtonTextDisabled: {
    color: '#f5f5f5',
  },
});
