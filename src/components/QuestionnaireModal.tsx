import React, { useState } from 'react';
import {
  View,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { QuestionnaireResponse } from '../types';

const { width, height } = Dimensions.get('window');

interface QuestionnaireModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (responses: QuestionnaireResponse) => void;
}

const QuestionnaireModal: React.FC<QuestionnaireModalProps> = ({
  isOpen,
  onClose,
  onComplete,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Partial<QuestionnaireResponse>>({
    interests: [],
    preferredLocations: [],
    budget: 'medium',
    availability: [],
    groupSize: 'solo',
    travelDistance: 50,
    eventTypes: [],
  });

  const questions = [
    {
      id: 'interests',
      title: 'Quels sont vos centres d\'intérêt ?',
      subtitle: 'Sélectionnez toutes les catégories qui vous intéressent',
      type: 'multiple',
      options: ['Musique', 'Sport', 'Art', 'Gastronomie', 'Technologie', 'Théâtre', 'Cinéma', 'Danse'],
    },
    {
      id: 'preferredLocations',
      title: 'Où préférez-vous assister aux événements ?',
      subtitle: 'Choisissez vos villes préférées',
      type: 'multiple',
      options: ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice', 'Nantes', 'Bordeaux', 'Lille'],
    },
    {
      id: 'budget',
      title: 'Quel est votre budget habituel ?',
      subtitle: 'Sélectionnez votre gamme de prix préférée',
      type: 'single',
      options: [
        { value: 'low', label: 'Économique (0-20€)' },
        { value: 'medium', label: 'Moyen (20-50€)' },
        { value: 'high', label: 'Premium (50€+)' },
      ],
    },
    {
      id: 'availability',
      title: 'Quand êtes-vous disponible ?',
      subtitle: 'Sélectionnez vos créneaux préférés',
      type: 'multiple',
      options: ['weekend', 'weekday', 'evening'],
      labels: ['Week-end', 'Semaine', 'Soirée'],
    },
    {
      id: 'groupSize',
      title: 'Avec qui assistez-vous aux événements ?',
      subtitle: 'Choisissez votre configuration habituelle',
      type: 'single',
      options: [
        { value: 'solo', label: 'Seul(e)' },
        { value: 'couple', label: 'En couple' },
        { value: 'small', label: 'Petit groupe (3-5)' },
        { value: 'large', label: 'Grand groupe (6+)' },
      ],
    },
  ];

  const currentQuestion = questions[currentStep];

  const handleOptionSelect = (option: string) => {
    const questionId = currentQuestion.id as keyof QuestionnaireResponse;
    
    if (currentQuestion.type === 'multiple') {
      const currentValues = responses[questionId] as string[] || [];
      const newValues = currentValues.includes(option)
        ? currentValues.filter(v => v !== option)
        : [...currentValues, option];
      
      setResponses(prev => ({ ...prev, [questionId]: newValues }));
    } else {
      setResponses(prev => ({ ...prev, [questionId]: option }));
    }
  };

  const isOptionSelected = (option: string) => {
    const questionId = currentQuestion.id as keyof QuestionnaireResponse;
    const value = responses[questionId];
    
    if (Array.isArray(value)) {
      return value.includes(option);
    }
    return value === option;
  };

  const canProceed = () => {
    const questionId = currentQuestion.id as keyof QuestionnaireResponse;
    const value = responses[questionId];
    
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    return value !== undefined && value !== '';
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(responses as QuestionnaireResponse);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progress = ((currentStep + 1) / questions.length) * 100;

  return (
    <Modal
      visible={isOpen}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Icon name="x" size={24} color="#666" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Personnalisation</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>
            {currentStep + 1} / {questions.length}
          </Text>
        </View>

        {/* Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.questionTitle}>{currentQuestion.title}</Text>
          <Text style={styles.questionSubtitle}>{currentQuestion.subtitle}</Text>

          <View style={styles.optionsContainer}>
            {currentQuestion.options.map((option, index) => {
              const optionValue = typeof option === 'string' ? option : option.value;
              const optionLabel = typeof option === 'string' 
                ? (currentQuestion.labels?.[index] || option)
                : option.label;
              
              return (
                <TouchableOpacity
                  key={optionValue}
                  style={[
                    styles.optionButton,
                    isOptionSelected(optionValue) && styles.optionButtonSelected,
                  ]}
                  onPress={() => handleOptionSelect(optionValue)}
                >
                  <Text style={[
                    styles.optionText,
                    isOptionSelected(optionValue) && styles.optionTextSelected,
                  ]}>
                    {optionLabel}
                  </Text>
                  {isOptionSelected(optionValue) && (
                    <Icon name="check" size={20} color="#FFFFFF" />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          {currentStep > 0 && (
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Icon name="arrow-left" size={20} color="#666" />
              <Text style={styles.backButtonText}>Retour</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={[
              styles.nextButton,
              !canProceed() && styles.nextButtonDisabled,
            ]}
            onPress={handleNext}
            disabled={!canProceed()}
          >
            <Text style={styles.nextButtonText}>
              {currentStep === questions.length - 1 ? 'Terminer' : 'Suivant'}
            </Text>
            <Icon name="arrow-right" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  closeButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 32,
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#1E88E5',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  questionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  questionSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  optionsContainer: {
    paddingBottom: 20,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionButtonSelected: {
    backgroundColor: '#1E88E5',
    borderColor: '#1565C0',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  optionTextSelected: {
    color: '#FFFFFF',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 8,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E88E5',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
  },
  nextButtonDisabled: {
    backgroundColor: '#CCC',
  },
  nextButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginRight: 8,
  },
});

export default QuestionnaireModal;