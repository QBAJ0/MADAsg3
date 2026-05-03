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

const commentFilter = new Filter({ placeHolder: '*' });

const theme = {
  background: '#fafafa',   // Clean background
  surface: '#ffffff',      // Input & Card background
  textMain: '#3e2723',     // Dark headings
  accent: '#D8A48F',       // Status text
  brandPrimary: '#A78682', // Buttons & Main borders
  warningBg: '#E7C6C2',    // Alert background & Disabled state
  muted: '#8d6e63',        // Placeholders & secondary text
};

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
    if (!text) return;

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
    Alert.alert('STEMM Lab', 'Reflection submitted successfully.');
  };

  const canSubmit = outcome === 'clean';

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        
        <View style={styles.header}>
          <Text style={styles.title}>STEMM Lab Safety Filter</Text>
        </View>

        <Text style={styles.label}>Your reflection or observation</Text>
        <TextInput
          style={[styles.field, styles.mainField]}
          value={comment}
          onChangeText={onCommentChange}
          placeholder="Type here..."
          placeholderTextColor={theme.muted}
          multiline
          textAlignVertical="top"
        />

        <Pressable
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: theme.brandPrimary, opacity: pressed ? 0.8 : 1 }
          ]}
          onPress={handleCheckComment}
        >
          <Text style={styles.buttonText}>Check Comment</Text>
        </Pressable>

        {outcome === 'clean' && (
          <View style={[styles.resultCard, { borderColor: theme.brandPrimary }]}>
            <Text style={styles.resultOk}>Comment is safe to submit.</Text>
          </View>
        )}

        {outcome === 'profane' && (
          <View style={[styles.resultCard, styles.resultCardWarn]}>
            <Text style={styles.resultWarn}>Inappropriate language detected</Text>
            <TextInput
              style={[styles.field, styles.cleanedField]}
              value={cleanedVersion}
              editable={false}
              multiline
              showSoftInputOnFocus={false}
            />
          </View>
        )}

        <Pressable
          style={[
            styles.button,
            { backgroundColor: theme.brandPrimary },
            !canSubmit && { backgroundColor: theme.warningBg, opacity: 0.6 }
          ]}
          onPress={handleSubmitComment}
          disabled={!canSubmit}
        >
          <Text style={styles.buttonText}>Submit Reflection</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.textMain,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.textMain,
    marginBottom: 10,
  },
  field: {
    minHeight: 140,
    borderWidth: 2,
    borderRadius: 15,
    padding: 15,
    fontSize: 16,
    backgroundColor: theme.surface,
    color: theme.brandPrimary,
    marginBottom: 20,
  },
  mainField: {
    borderColor: theme.brandPrimary,
  },
  cleanedField: {
    minHeight: 100,
    marginBottom: 0,
    borderColor: theme.brandPrimary,
    color: theme.muted,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: theme.surface,
    fontSize: 18,
    fontWeight: '700',
  },
  resultCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 2,
    backgroundColor: theme.surface,
  },
  resultCardWarn: {
    backgroundColor: theme.warningBg,
    borderColor: theme.brandPrimary,
  },
  resultOk: {
    color: theme.accent,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  resultWarn: {
    color: theme.textMain,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
});