import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const apiUrl = Constants.expoConfig?.extra?.apiUrl;

interface Achievement {
  name: string;
  description: string;
  earned: boolean;
  progress: number;
}

interface PerformanceRanking {
  level: string;
  score: number;
  nextLevelRequirements: string[];
}

interface Milestone {
  milestone: string;
  current: number;
  target: number;
  progress: number;
}

interface AchievementsData {
  achievements: Achievement[];
  performanceRanking: PerformanceRanking;
  nextMilestones: Milestone[];
}

export default function AchievementsScreen() {
  const router = useRouter();
  const [achievementsData, setAchievementsData] = useState<AchievementsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAchievementsData();
  }, []);

  const fetchAchievementsData = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const res = await fetch(`${apiUrl}/shippers/achievements`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setAchievementsData(data);
      }
    } catch (err) {
      console.error('Error fetching achievements data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <LinearGradient colors={['#9F6508', '#F3C871', '#FFF3B4']} style={styles.container}>
        <Text style={styles.loadingText}>Đang tải...</Text>
      </LinearGradient>
    );
  }

  const earnedAchievements = achievementsData?.achievements.filter(a => a.earned) || [];
  const pendingAchievements = achievementsData?.achievements.filter(a => !a.earned) || [];

  return (
    <LinearGradient colors={['#9F6508', '#F3C871', '#FFF3B4']} style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backText}>‹ Quay lại</Text>
          </TouchableOpacity>
          <Text style={styles.title}>🏆 Thành tích & Cấp độ</Text>
        </View>

        {achievementsData && (
          <>
            {/* Performance Level */}
            <View style={styles.levelCard}>
              <Text style={styles.levelTitle}>Cấp độ hiện tại</Text>
              <Text style={styles.levelName}>{achievementsData.performanceRanking.level}</Text>
              <Text style={styles.levelScore}>Điểm: {achievementsData.performanceRanking.score}</Text>
              
              {achievementsData.performanceRanking.nextLevelRequirements.length > 0 && (
                <View style={styles.requirementsList}>
                  <Text style={styles.requirementsTitle}>Yêu cầu cấp độ tiếp theo:</Text>
                  {achievementsData.performanceRanking.nextLevelRequirements.map((req, index) => (
                    <Text key={index} style={styles.requirementText}>• {req}</Text>
                  ))}
                </View>
              )}
            </View>

            {/* Earned Achievements */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                🏅 Thành tích đã đạt ({earnedAchievements.length})
              </Text>
              {earnedAchievements.map((achievement, index) => (
                <View key={index} style={[styles.achievementCard, styles.earnedCard]}>
                  <View style={styles.achievementHeader}>
                    <Text style={styles.achievementIcon}>🏆</Text>
                    <View style={styles.achievementContent}>
                      <Text style={styles.achievementName}>{achievement.name}</Text>
                      <Text style={styles.achievementDesc}>{achievement.description}</Text>
                    </View>
                    <Text style={styles.earnedBadge}>✅</Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Pending Achievements */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                🎯 Đang tiến tới ({pendingAchievements.length})
              </Text>
              {pendingAchievements.map((achievement, index) => (
                <View key={index} style={styles.achievementCard}>
                  <View style={styles.achievementHeader}>
                    <Text style={styles.achievementIcon}>🏅</Text>
                    <View style={styles.achievementContent}>
                      <Text style={styles.achievementName}>{achievement.name}</Text>
                      <Text style={styles.achievementDesc}>{achievement.description}</Text>
                    </View>
                  </View>
                  <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                      <View style={[
                        styles.progressFill, 
                        { width: `${Math.min(achievement.progress, 100)}%` }
                      ]} />
                    </View>
                    <Text style={styles.progressText}>
                      {Math.round(achievement.progress)}%
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Next Milestones */}
            {achievementsData.nextMilestones.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>🎯 Mục tiêu sắp tới</Text>
                {achievementsData.nextMilestones.map((milestone, index) => (
                  <View key={index} style={styles.milestoneCard}>
                    <Text style={styles.milestoneName}>{milestone.milestone}</Text>
                    <Text style={styles.milestoneProgress}>
                      {milestone.current.toLocaleString()} / {milestone.target.toLocaleString()}
                    </Text>
                    <View style={styles.progressContainer}>
                      <View style={styles.progressBar}>
                        <View style={[
                          styles.progressFill, 
                          { width: `${Math.min(milestone.progress, 100)}%` }
                        ]} />
                      </View>
                      <Text style={styles.progressText}>
                        {Math.round(milestone.progress)}%
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingText: { 
    textAlign: 'center', 
    marginTop: 50, 
    fontSize: 18, 
    color: '#fff' 
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    marginBottom: 10,
  },
  backText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  levelCard: {
    margin: 20,
    backgroundColor: '#FFD700',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  levelTitle: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  levelName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  levelScore: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  requirementsList: {
    alignSelf: 'stretch',
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  requirementText: {
    fontSize: 13,
    color: '#555',
    marginBottom: 4,
  },
  section: {
    margin: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  achievementCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  earnedCard: {
    backgroundColor: '#E8F5E8',
    borderColor: '#4CAF50',
    borderWidth: 1,
  },
  achievementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  achievementIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  achievementContent: {
    flex: 1,
  },
  achievementName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  achievementDesc: {
    fontSize: 14,
    color: '#666',
  },
  earnedBadge: {
    fontSize: 20,
  },
  progressContainer: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    fontWeight: 'bold',
    minWidth: 35,
  },
  milestoneCard: {
    backgroundColor: '#FFF3B4',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  milestoneName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  milestoneProgress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
});