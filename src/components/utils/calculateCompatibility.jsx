/**
 * Calculates compatibility score between two user profiles
 * based on shared attributes and preferences
 */
export function calculateCompatibility(userProfile, targetProfile) {
  let score = 0;
  let maxScore = 0;

  // Religion match (15 points)
  maxScore += 15;
  if (userProfile.religion && targetProfile.religion) {
    if (userProfile.religion === targetProfile.religion) {
      score += 15;
    } else if (userProfile.preferred_partner_religion?.includes(targetProfile.religion)) {
      score += 10;
    }
  }

  // Ethnicity preference match (15 points)
  maxScore += 15;
  if (userProfile.ethnicity && targetProfile.ethnicity) {
    if (userProfile.preferred_partner_ethnicity?.includes(targetProfile.ethnicity) ||
        userProfile.preferred_partner_ethnicity?.length === 0) {
      score += 15;
    }
    if (userProfile.ethnicity === targetProfile.ethnicity) {
      score += 5; // Bonus for same ethnicity
    }
  }

  // Relationship goals alignment (20 points)
  maxScore += 20;
  if (userProfile.relationship_goal && targetProfile.relationship_goal) {
    const goals = ['dil_se_casual', 'vibe_check', 'lets_see', 'light_dating', 'real_connection', 'long_term_serious', 'shaadi_ready'];
    const userIndex = goals.indexOf(userProfile.relationship_goal);
    const targetIndex = goals.indexOf(targetProfile.relationship_goal);
    const diff = Math.abs(userIndex - targetIndex);
    
    if (diff === 0) score += 20;
    else if (diff === 1) score += 15;
    else if (diff === 2) score += 10;
    else if (diff === 3) score += 5;
  }

  // Shared interests (15 points)
  maxScore += 15;
  if (userProfile.interests?.length && targetProfile.interests?.length) {
    const sharedInterests = userProfile.interests.filter(i => 
      targetProfile.interests.includes(i)
    );
    const interestScore = Math.min((sharedInterests.length / 3) * 15, 15);
    score += interestScore;
  }

  // Diet compatibility (10 points)
  maxScore += 10;
  if (userProfile.diet && targetProfile.diet) {
    const vegDiets = ['vegetarian', 'vegan', 'jain_veg'];
    const userVeg = vegDiets.includes(userProfile.diet);
    const targetVeg = vegDiets.includes(targetProfile.diet);
    
    if (userProfile.diet === targetProfile.diet) {
      score += 10;
    } else if (userVeg === targetVeg) {
      score += 7;
    } else {
      score += 3;
    }
  }

  // Lifestyle habits - drinking (5 points)
  maxScore += 5;
  if (userProfile.drinking && targetProfile.drinking) {
    if (userProfile.drinking === targetProfile.drinking) {
      score += 5;
    } else if (
      (userProfile.drinking === 'never' && targetProfile.drinking === 'socially') ||
      (userProfile.drinking === 'socially' && targetProfile.drinking === 'never')
    ) {
      score += 3;
    }
  }

  // Lifestyle habits - smoking (5 points)
  maxScore += 5;
  if (userProfile.smoking && targetProfile.smoking) {
    if (userProfile.smoking === targetProfile.smoking) {
      score += 5;
    } else if (userProfile.smoking === 'never' && targetProfile.smoking !== 'never') {
      score += 0; // Non-smokers usually prefer non-smokers
    } else {
      score += 2;
    }
  }

  // Culture importance alignment (10 points)
  maxScore += 10;
  if (userProfile.culture_importance && targetProfile.culture_importance) {
    const levels = ['not_important', 'somewhat_important', 'important', 'very_important'];
    const userIndex = levels.indexOf(userProfile.culture_importance);
    const targetIndex = levels.indexOf(targetProfile.culture_importance);
    const diff = Math.abs(userIndex - targetIndex);
    
    if (diff === 0) score += 10;
    else if (diff === 1) score += 7;
    else if (diff === 2) score += 4;
  }

  // Family involvement alignment (5 points)
  maxScore += 5;
  if (userProfile.family_involvement && targetProfile.family_involvement) {
    if (userProfile.family_involvement === targetProfile.family_involvement) {
      score += 5;
    }
  }

  // Calculate percentage (minimum 50% to keep it positive)
  const percentage = maxScore > 0 ? (score / maxScore) * 100 : 50;
  
  // Scale to 50-99 range for better UX
  return Math.round(50 + (percentage / 2));
}