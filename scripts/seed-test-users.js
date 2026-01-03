import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://smxpsjjtzccsqnfgywnd.supabase.co';
const serviceRoleKey = 'sb_secret_OeULq1DOmm6S5CWfmFJvmg_NzPaV4mo';

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// All test users have wide age ranges (18-50) and large distance (1000 miles)
// to ensure bidirectional matching works for testing
// 5 females looking for males, 2 males looking for females
const testUsers = [
  {
    email: 'test1@example.com',
    password: 'P@ssw0rd',
    profile: {
      first_name: 'Priya',
      age: 25,
      gender: 'female',
      country: 'USA',
      state: 'California',
      city: 'Los Angeles',
      latitude: 34.0522,
      longitude: -118.2437,
      ethnicity: 'punjabi',
      religion: 'sikh',
      marital_status: 'single',
      education: 'masters',
      occupation: 'Software Engineer',
      diet: 'vegetarian',
      drinking: 'never',
      smoking: 'never',
      height_feet: 5,
      height_inches: 6,
      languages: ['English', 'Hindi', 'Punjabi'],
      culture_importance: 'important',
      interests: ['Music', 'Travel', 'Yoga', 'Technology'],
      personality_type: 'outgoing_social',
      relationship_goal: 'real_connection',
      preference_gender: 'male',
      preference_age_min: 18,
      preference_age_max: 50,
      preference_distance_miles: 1000,
      photos: ['https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400']
    }
  },
  {
    email: 'test2@example.com',
    password: 'P@ssw0rd',
    profile: {
      first_name: 'Ananya',
      age: 28,
      gender: 'female',
      country: 'USA',
      state: 'California',
      city: 'San Diego',
      latitude: 32.7157,
      longitude: -117.1611,
      ethnicity: 'bengali',
      religion: 'hindu',
      marital_status: 'single',
      education: 'doctorate',
      occupation: 'Doctor',
      diet: 'non_veg',
      drinking: 'socially',
      smoking: 'never',
      height_feet: 5,
      height_inches: 4,
      languages: ['English', 'Bengali', 'Hindi'],
      culture_importance: 'very_important',
      interests: ['Reading', 'Cooking', 'Dance', 'Art'],
      personality_type: 'reserved_thoughtful',
      relationship_goal: 'long_term_serious',
      preference_gender: 'male',
      preference_age_min: 18,
      preference_age_max: 50,
      preference_distance_miles: 1000,
      photos: ['https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400']
    }
  },
  {
    email: 'test3@example.com',
    password: 'P@ssw0rd',
    profile: {
      first_name: 'Neha',
      age: 23,
      gender: 'female',
      country: 'USA',
      state: 'Nevada',
      city: 'Las Vegas',
      latitude: 36.1699,
      longitude: -115.1398,
      ethnicity: 'gujarati',
      religion: 'hindu',
      marital_status: 'single',
      education: 'bachelors',
      occupation: 'Marketing Manager',
      diet: 'eggetarian',
      drinking: 'socially',
      smoking: 'never',
      height_feet: 5,
      height_inches: 5,
      languages: ['English', 'Gujarati'],
      culture_importance: 'somewhat_important',
      interests: ['Fashion', 'Photography', 'Music', 'Nightlife'],
      personality_type: 'outgoing_social',
      relationship_goal: 'lets_see',
      preference_gender: 'male',
      preference_age_min: 18,
      preference_age_max: 50,
      preference_distance_miles: 1000,
      photos: ['https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400']
    }
  },
  {
    email: 'test4@example.com',
    password: 'P@ssw0rd',
    profile: {
      first_name: 'Kavitha',
      age: 30,
      gender: 'female',
      country: 'USA',
      state: 'Arizona',
      city: 'Phoenix',
      latitude: 33.4484,
      longitude: -112.0740,
      ethnicity: 'tamil',
      religion: 'hindu',
      marital_status: 'single',
      education: 'masters',
      occupation: 'Teacher',
      diet: 'vegetarian',
      drinking: 'never',
      smoking: 'never',
      height_feet: 5,
      height_inches: 3,
      languages: ['English', 'Tamil'],
      culture_importance: 'very_important',
      interests: ['Art', 'Meditation', 'Nature', 'Spirituality'],
      personality_type: 'reserved_thoughtful',
      relationship_goal: 'shaadi_ready',
      preference_gender: 'male',
      preference_age_min: 18,
      preference_age_max: 50,
      preference_distance_miles: 1000,
      photos: ['https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400']
    }
  },
  {
    email: 'test5@example.com',
    password: 'P@ssw0rd',
    profile: {
      first_name: 'Riya',
      age: 26,
      gender: 'female',
      country: 'USA',
      state: 'California',
      city: 'San Francisco',
      latitude: 37.7749,
      longitude: -122.4194,
      ethnicity: 'marathi',
      religion: 'hindu',
      marital_status: 'single',
      education: 'masters',
      occupation: 'Data Scientist',
      diet: 'pescatarian',
      drinking: 'socially',
      smoking: 'never',
      height_feet: 5,
      height_inches: 7,
      languages: ['English', 'Hindi', 'Marathi'],
      culture_importance: 'somewhat_important',
      interests: ['Tech', 'Hiking', 'Movies', 'Gaming'],
      personality_type: 'outgoing_social',
      relationship_goal: 'real_connection',
      preference_gender: 'male',
      preference_age_min: 18,
      preference_age_max: 50,
      preference_distance_miles: 1000,
      photos: ['https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400']
    }
  },
  {
    email: 'test6@example.com',
    password: 'P@ssw0rd',
    profile: {
      first_name: 'Arjun',
      age: 27,
      gender: 'male',
      country: 'USA',
      state: 'California',
      city: 'Sacramento',
      latitude: 38.5816,
      longitude: -121.4944,
      ethnicity: 'punjabi',
      religion: 'sikh',
      marital_status: 'single',
      education: 'bachelors',
      occupation: 'Engineer',
      diet: 'non_veg',
      drinking: 'socially',
      smoking: 'never',
      height_feet: 5,
      height_inches: 11,
      languages: ['English', 'Punjabi', 'Hindi'],
      culture_importance: 'important',
      interests: ['Sports', 'Gaming', 'Music', 'Cars'],
      personality_type: 'outgoing_social',
      relationship_goal: 'long_term_serious',
      preference_gender: 'female',
      preference_age_min: 18,
      preference_age_max: 50,
      preference_distance_miles: 1000,
      photos: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400']
    }
  },
  {
    email: 'test7@example.com',
    password: 'P@ssw0rd',
    profile: {
      first_name: 'Vikram',
      age: 29,
      gender: 'male',
      country: 'USA',
      state: 'California',
      city: 'Fresno',
      latitude: 36.7378,
      longitude: -119.7871,
      ethnicity: 'tamil',
      religion: 'hindu',
      marital_status: 'single',
      education: 'doctorate',
      occupation: 'Lawyer',
      diet: 'vegetarian',
      drinking: 'never',
      smoking: 'never',
      height_feet: 6,
      height_inches: 0,
      languages: ['English', 'Tamil'],
      culture_importance: 'very_important',
      interests: ['Reading', 'Travel', 'Food', 'Politics'],
      personality_type: 'reserved_thoughtful',
      relationship_goal: 'shaadi_ready',
      preference_gender: 'female',
      preference_age_min: 18,
      preference_age_max: 50,
      preference_distance_miles: 1000,
      photos: ['https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400']
    }
  }
];

async function seedUsers() {
  console.log('Starting to seed test users...\n');

  for (const user of testUsers) {
    try {
      // 1. Create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true
      });

      if (authError) {
        if (authError.message.includes('already been registered')) {
          console.log(`⚠️  ${user.email} already exists, skipping...`);
          continue;
        }
        throw authError;
      }

      const userId = authData.user.id;
      console.log(`✅ Created auth user: ${user.email} (${userId})`);

      // 2. Create profile
      const profileData = {
        id: userId,
        email: user.email,
        first_name: user.profile.first_name,
        age: user.profile.age,
        gender: user.profile.gender,
        country: user.profile.country,
        state: user.profile.state,
        city: user.profile.city,
        location_coordinates: `POINT(${user.profile.longitude} ${user.profile.latitude})`,
        ethnicity: user.profile.ethnicity,
        religion: user.profile.religion,
        marital_status: user.profile.marital_status,
        education: user.profile.education,
        occupation: user.profile.occupation,
        diet: user.profile.diet,
        drinking: user.profile.drinking,
        smoking: user.profile.smoking,
        height_feet: user.profile.height_feet,
        height_inches: user.profile.height_inches,
        languages: user.profile.languages,
        culture_importance: user.profile.culture_importance,
        interests: user.profile.interests,
        personality_type: user.profile.personality_type,
        relationship_goal: user.profile.relationship_goal,
        preference_gender: user.profile.preference_gender,
        preference_age_min: user.profile.preference_age_min,
        preference_age_max: user.profile.preference_age_max,
        preference_distance_miles: user.profile.preference_distance_miles,
        preference_languages: ['English'],
        photos: user.profile.photos,
        prompts: [],
        profile_complete: true,
        onboarding_step: 8,
        is_hidden: false,
        is_premium: false
      };

      const { error: profileError } = await supabase
        .from('profiles')
        .insert(profileData);

      if (profileError) {
        console.error(`❌ Failed to create profile for ${user.email}:`, profileError.message);
      } else {
        console.log(`   ✅ Created profile: ${user.profile.first_name}, ${user.profile.age}, ${user.profile.city}\n`);
      }

    } catch (error) {
      console.error(`❌ Error creating ${user.email}:`, error.message);
    }
  }

  console.log('\n🎉 Seeding complete!');
  console.log('\nTest accounts created:');
  console.log('Email: test1@example.com - test7@example.com');
  console.log('Password: P@ssw0rd');
}

seedUsers();
