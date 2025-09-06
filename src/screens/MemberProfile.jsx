import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, Image, I18nManager } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Force left-to-right layout if RTL is enabled
if (I18nManager.isRTL) {
  I18nManager.forceRTL(false);
  // On Android, you may need to reload the app for this to take effect
}

const MemberProfile = () => {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const [currentStep, setCurrentStep] = useState(0);

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    weight: '',
    height: '',
    healthConditions: '',
    fitnessGoal: '',
  });

  const [weightUnit, setWeightUnit] = useState('KG');
  const [heightUnit, setHeightUnit] = useState('CM');

  const steps = [
    {
      title: "WHAT'S YOUR NAME?",
      field: 'name',
      type: 'text',
    },
    {
      title: "HOW OLD ARE YOU?",
      field: 'age',
      type: 'number',
    },
    {
      title: "WHAT'S YOUR GENDER?",
      field: 'gender',
      type: 'gender',
    },
    {
      title: "WHAT'S YOUR CURRENT WEIGHT?",
      field: 'weight',
      type: 'weight',
    },
    {
      title: "WHAT'S YOUR HEIGHT?",
      field: 'height',
      type: 'height',
    },
    {
      title: "WHAT'S YOUR GOAL?",
      field: 'fitnessGoal',
      type: 'goal',
    },
  ];

  const goals = [
    { title: "Build strength", subtitle: "Get stronger without getting bulky" },
    { title: "Get in shape", subtitle: "Build your fitness and discipline from the ground up" },
    { title: "Build Muscle", subtitle: "Increase muscle size and strength" },
    { title: "Get Lean", subtitle: "Lose body fat and become more defined" },

  ];

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const totalSteps = steps.length;

  const validateCurrentStep = () => {
    const currentField = currentStepData.field;
    const value = formData[currentField];

    if (!value || value.trim() === '') {
      Alert.alert('Required Field', 'Please fill out this field to continue.');
      return false;
    }

    if (currentField === 'age') {
      const age = parseInt(value, 10);
      if (isNaN(age) || age < 1 || age > 120) {
        Alert.alert('Invalid Age', 'Please enter a valid age between 1 and 120.');
        return false;
      }
    }

    if (currentField === 'weight') {
      const weight = parseFloat(value);
      if (isNaN(weight) || weight < 1 || weight > 500) {
        Alert.alert('Invalid Weight', 'Please enter a valid weight.');
        return false;
      }
    }

    if (currentField === 'height') {
      const height = parseFloat(value);
      if (isNaN(height) || height < 50 || height > 300) {
        Alert.alert('Invalid Height', 'Please enter a valid height.');
        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;

    if (isLastStep) {
      handleSubmit();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      navigation.goBack();
    }
  };

  const handleSkip = () => {
    navigation.goBack();
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // simulate network delay
      navigation.navigate('MainTabs');
    } catch (err) {
      Alert.alert('Profile Setup Failed', 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (value) => {
    setFormData({
      ...formData,
      [currentStepData.field]: value,
    });
  };

  const renderInput = () => {
    switch (currentStepData.type) {
      case 'text':
        return (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder=""
              placeholderTextColor="#999"
              value={formData[currentStepData.field]}
              onChangeText={updateFormData}
              autoFocus={true}
            />
            <View style={styles.inputLine} />
          </View>
        );

      case 'number':
        return (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder=""
              placeholderTextColor="#999"
              keyboardType="numeric"
              value={formData[currentStepData.field]}
              onChangeText={updateFormData}
              autoFocus={true}
            />
            <View style={styles.inputLine} />
          </View>
        );

      case 'gender':
        return (
          <View style={styles.genderContainer}>
            <TouchableOpacity
              style={[
                styles.genderOption,
                formData.gender === 'Male' && styles.genderSelected,
              ]}
              onPress={() => updateFormData('Male')}
            >
              <View style={styles.genderImage}>
                <Image
                  source={require('../assets/boyy.jpg')}
                  style={styles.genderImageStyle}
                />
              </View>
              <View
                style={[
                  styles.radioButton,
                  formData.gender === 'Male' && styles.radioSelected,
                ]}
              />
              <Text style={styles.genderText}>Male</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.genderOption,
                formData.gender === 'Female' && styles.genderSelected,
              ]}
              onPress={() => updateFormData('Female')}
            >
              <View style={styles.genderImage}>
                <Image
                  source={require('../assets/girll.jpg')}
                  style={styles.genderImageStyle}
                />
              </View>
              <View
                style={[
                  styles.radioButton,
                  formData.gender === 'Female' && styles.radioSelected,
                ]}
              />
              <Text style={styles.genderText}>Female</Text>
            </TouchableOpacity>
          </View>
        );

      case 'weight':
        return (
          <View style={styles.weightContainer}>
            <View style={styles.unitToggle}>
              <TouchableOpacity
                style={[
                  styles.unitButton,
                  weightUnit === 'KG' && styles.unitSelected,
                ]}
                onPress={() => setWeightUnit('KG')}
              >
                <Text
                  style={[
                    styles.unitText,
                    weightUnit === 'KG' && styles.unitTextSelected,
                  ]}
                >
                  KG
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.unitButton,
                  weightUnit === 'LBS' && styles.unitSelected,
                ]}
                onPress={() => setWeightUnit('LBS')}
              >
                <Text
                  style={[
                    styles.unitText,
                    weightUnit === 'LBS' && styles.unitTextSelected,
                  ]}
                >
                  LBS
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder=""
                placeholderTextColor="#999"
                keyboardType="numeric"
                value={formData.weight}
                onChangeText={updateFormData}
                autoFocus={true}
              />
              <View style={styles.inputLine} />
            </View>
            <View style={styles.bmiContainer}>
              <Text style={styles.bmiLabel}>YOUR CURRENT BMI</Text>
              <Text style={styles.bmiValue}>00.0</Text>
              <Text style={styles.bmiMessage}>
                You may need to do more workout to be better
              </Text>
            </View>
          </View>
        );

      case 'height':
        return (
          <View style={styles.heightContainer}>
            <View style={styles.unitToggle}>
              <TouchableOpacity
                style={[
                  styles.unitButton,
                  heightUnit === 'CM' && styles.unitSelected,
                ]}
                onPress={() => setHeightUnit('CM')}
              >
                <Text
                  style={[
                    styles.unitText,
                    heightUnit === 'CM' && styles.unitTextSelected,
                  ]}
                >
                  CM
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.unitButton,
                  heightUnit === 'FT' && styles.unitSelected,
                ]}
                onPress={() => setHeightUnit('FT')}
              >
                <Text
                  style={[
                    styles.unitText,
                    heightUnit === 'FT' && styles.unitTextSelected,
                  ]}
                >
                  FT
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder=""
                placeholderTextColor="#999"
                keyboardType="numeric"
                value={formData.height}
                onChangeText={updateFormData}
                autoFocus={true}
              />
              <View style={styles.inputLine} />
            </View>
          </View>
        );

      case 'goal':
        return (
          <View style={styles.goalsContainer}>
            {goals.map((goal, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.goalCard,
                  formData.fitnessGoal === goal.title && styles.goalSelected,
                ]}
                onPress={() => updateFormData(goal.title)}
              >
                <Text style={styles.goalTitle}>{goal.title}</Text>
                <Text style={styles.goalSubtitle}>{goal.subtitle}</Text>
              </TouchableOpacity>
            ))}
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: '#006258' }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={[styles.backIcon, { color: '#2196F3' }]}>‹</Text>
        </TouchableOpacity>

        <View style={[styles.progressBar, { backgroundColor: '#CCCCCC' }]}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${((currentStep + 1) / totalSteps) * 100}%`,
                backgroundColor: '#2196F3',
              },
            ]}
          />
        </View>

        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={[styles.skipText, { color: '#2196F3' }]}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <Text style={[styles.question, { color: '#FFFFFF' }]}>
          {currentStepData.title}
        </Text>
        {renderInput()}
      </View>

      {/* Next Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.nextButton, { backgroundColor: '#2196F3' }]}
          onPress={handleNext}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={[styles.nextButtonText, { color: '#FFFFFF' }]}>
              Next
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  progressBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    marginHorizontal: 20,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  skipButton: {
    paddingHorizontal: 10,
  },
  skipText: {
    fontSize: 16,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  question: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
    textTransform: 'uppercase',
  },
  inputContainer: {
    width: '100%',
    alignItems: 'center',
  },
  textInput: {
    width: '100%',
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    paddingVertical: 10,
  },
  inputLine: {
    width: '100%',
    height: 1,
    backgroundColor: '#FFFFFF',
    marginTop: 5,
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  genderOption: {
    alignItems: 'center',
    padding: 20,
  },
  genderImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    overflow: 'hidden',
  },
  genderImageStyle: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#2196F3',
    marginBottom: 10,
  },
  radioSelected: {
    backgroundColor: '#2196F3',
  },
  genderText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  weightContainer: {
    width: '100%',
    alignItems: 'center',
  },
  unitToggle: {
    flexDirection: 'row',
    backgroundColor: '#004D40',
    borderRadius: 8,
    padding: 4,
    marginBottom: 30,
  },
  unitButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  unitSelected: {
    backgroundColor: '#2196F3',
  },
  unitText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  unitTextSelected: {
    color: '#FFF',
  },
  bmiContainer: {
    alignItems: 'center',
    marginTop: 30,
  },
  bmiLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  bmiValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  bmiMessage: {
    fontSize: 14,
    color: '#B2DFDB',
    textAlign: 'center',
  },
  heightContainer: {
    width: '100%',
    alignItems: 'center',
  },
  goalsContainer: {
    width: '100%',
    gap: 15,
  },
  goalCard: {
    backgroundColor: '#004D40',
    borderRadius: 12,
    padding: 20,
    marginBottom: 10,
  },
  goalSelected: {
    backgroundColor: '#2196F3',
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 5,
  },
  goalSubtitle: {
    fontSize: 14,
    color: '#E0F2F1',
    opacity: 0.8,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  nextButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default MemberProfile;
