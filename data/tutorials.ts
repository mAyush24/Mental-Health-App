export const tutorialSteps = {
  "mood-tracker": [
    {
      id: "welcome",
      title: "Welcome to Mood Tracking! 😊",
      description:
        "Let's learn how to track your daily emotions and build healthy habits. This tutorial will guide you through the process step by step.",
    },
    {
      id: "select-mood",
      title: "Choose Your Current Mood",
      description:
        "Start by selecting the emoji that best represents how you're feeling right now. Don't overthink it - go with your first instinct!",
      target: "[data-tutorial='mood-selection']",
      highlight: true,
      action: "Tap on any mood emoji to select it",
    },
    {
      id: "intensity",
      title: "Rate Your Mood Intensity",
      description:
        "Use the slider to indicate how intense this feeling is on a scale of 1-10. This helps you track subtle changes in your emotional state.",
      target: "[data-tutorial='mood-intensity']",
      highlight: true,
      action: "Move the slider to rate your mood intensity",
    },
    {
      id: "tags",
      title: "Add Context with Tags",
      description:
        "Select tags that might be influencing your mood today. This helps you identify patterns and triggers over time.",
      target: "[data-tutorial='mood-tags']",
      highlight: true,
      action: "Tap on relevant tags like 'Work', 'Family', or 'Exercise'",
    },
    {
      id: "journal",
      title: "Write a Journal Entry (Optional)",
      description:
        "Add any thoughts, experiences, or reflections about your day. Journaling can provide deeper insights into your emotional patterns.",
      target: "[data-tutorial='journal-entry']",
      highlight: true,
      action: "Try writing a few words about your day",
    },
    {
      id: "save",
      title: "Save Your Mood Entry",
      description:
        "Click the save button to record your mood. You'll earn points and maintain your streak by tracking consistently!",
      target: "[data-tutorial='save-mood']",
      highlight: true,
      action: "Click 'Save Mood Entry' to complete your first entry",
    },
    {
      id: "complete",
      title: "Great Job! 🎉",
      description:
        "You've completed your first mood entry! Try to track your mood daily to build insights and maintain your wellness streak.",
    },
  ],

  breathing: [
    {
      id: "welcome",
      title: "Welcome to Breathing Exercises! 🫁",
      description:
        "Breathing exercises are a powerful tool for managing stress, improving focus, and promoting relaxation. Let's explore how to use them effectively.",
    },
    {
      id: "techniques",
      title: "Choose a Breathing Technique",
      description:
        "We offer 6 different breathing techniques, each with unique benefits. Start with 'Box Breathing' or 'Triangle Breathing' if you're new to this practice.",
      target: "[data-tutorial='breathing-techniques']",
      highlight: true,
      action: "Tap on any technique card to learn more about it",
    },
    {
      id: "technique-details",
      title: "Understanding the Technique",
      description:
        "Each technique shows the breathing pattern (inhale-hold-exhale), difficulty level, and specific benefits. Choose one that matches your current needs.",
      target: "[data-tutorial='technique-card']",
      highlight: true,
      action: "Review the breathing pattern and benefits",
    },
    {
      id: "start-session",
      title: "Start Your First Session",
      description:
        "Click on a technique card to begin your breathing session. The app will guide you through each breath with visual and audio cues.",
      target: "[data-tutorial='start-breathing']",
      highlight: true,
      action: "Click on a technique to start your first session",
    },
    {
      id: "visual-guide",
      title: "Follow the Visual Guide",
      description:
        "During the session, watch the breathing circle expand and contract. Breathe in as it grows, hold when it pauses, and breathe out as it shrinks.",
    },
    {
      id: "controls",
      title: "Session Controls",
      description:
        "You can pause, resume, or reset your session at any time. Don't worry if you need to stop - you can always continue later!",
    },
    {
      id: "complete",
      title: "Well Done! 🌟",
      description:
        "Regular breathing practice can significantly improve your mental well-being. Try to practice for just 5 minutes daily to see the benefits.",
    },
  ],

  calendar: [
    {
      id: "welcome",
      title: "Welcome to Your Mood Calendar! 📅",
      description:
        "Your mood calendar helps you visualize emotional patterns over time. Let's explore how to read and use this powerful tool.",
    },
    {
      id: "calendar-view",
      title: "Understanding the Calendar",
      description:
        "Each day shows your mood with an emoji and color. Colors represent intensity: red (low), orange (mild), yellow (good), green (great).",
      target: "[data-tutorial='calendar-grid']",
      highlight: true,
      action: "Look at the different colored days to see your mood patterns",
    },
    {
      id: "day-details",
      title: "View Day Details",
      description:
        "Click on any day with a mood entry to see detailed information including your mood, intensity rating, and any notes you added.",
      target: "[data-tutorial='calendar-day']",
      highlight: true,
      action: "Click on a day with a mood entry to see details",
    },
    {
      id: "navigation",
      title: "Navigate Between Months",
      description:
        "Use the arrow buttons to view previous or future months. This helps you track long-term patterns and progress.",
      target: "[data-tutorial='calendar-navigation']",
      highlight: true,
      action: "Try clicking the left or right arrow to change months",
    },
    {
      id: "patterns",
      title: "Identify Patterns",
      description:
        "Look for patterns in your mood data. Do you feel better on certain days of the week? Are there seasonal trends? These insights can guide your wellness journey.",
    },
    {
      id: "complete",
      title: "Calendar Mastery! 📊",
      description:
        "Use your calendar regularly to spot trends and celebrate your progress. Remember, every mood entry contributes to your personal insights!",
    },
  ],

  community: [
    {
      id: "welcome",
      title: "Welcome to the Community! 👥",
      description:
        "Our community is a safe, supportive space where you can share experiences and connect with others on their wellness journey.",
    },
    {
      id: "guidelines",
      title: "Community Guidelines",
      description:
        "This is an anonymous, supportive environment. Please be kind, respectful, and remember that everyone is on their own unique path.",
      target: "[data-tutorial='community-guidelines']",
      highlight: true,
    },
    {
      id: "create-post",
      title: "Share Your Thoughts",
      description:
        "Use the text area to share something positive, ask for support, or offer encouragement to others. Your posts are anonymous for privacy.",
      target: "[data-tutorial='new-post']",
      highlight: true,
      action: "Try typing a supportive message or question",
    },
    {
      id: "post-features",
      title: "Post Features",
      description:
        "You can write up to 500 characters and earn 5 points for each post. Posts are anonymous, so feel free to be open and authentic.",
      target: "[data-tutorial='post-button']",
      highlight: true,
      action: "Click 'Share' when you're ready to post",
    },
    {
      id: "interact",
      title: "Support Others",
      description:
        "Like posts that resonate with you and consider replying with encouragement. Your support makes a real difference in someone's day.",
      target: "[data-tutorial='community-feed']",
      highlight: true,
      action: "Try liking a post or leaving an encouraging comment",
    },
    {
      id: "complete",
      title: "Community Connected! 💚",
      description:
        "You're now part of our supportive community. Remember, sharing and supporting others is just as healing as receiving support yourself.",
    },
  ],

  progress: [
    {
      id: "welcome",
      title: "Welcome to Your Progress Hub! 📈",
      description:
        "Track your wellness journey, celebrate achievements, and set new goals. Let's explore all the ways to monitor your growth.",
    },
    {
      id: "overview-stats",
      title: "Your Wellness Stats",
      description:
        "These cards show your key metrics: total points earned, current streak, average mood, and total check-ins. Watch these grow over time!",
      target: "[data-tutorial='stats-grid']",
      highlight: true,
    },
    {
      id: "detailed-stats",
      title: "Detailed Analytics",
      description:
        "Get deeper insights into your wellness journey with detailed statistics about your habits, community engagement, and progress over time.",
      target: "[data-tutorial='detailed-stats']",
      highlight: true,
    },
    {
      id: "achievements",
      title: "Unlock Achievements",
      description:
        "Switch to the Achievements tab to see all available badges and rewards. Earn them by maintaining streaks, engaging with the community, and reaching milestones.",
      target: "[data-tutorial='achievements-tab']",
      highlight: true,
      action: "Click on the 'Achievements' tab to explore available rewards",
    },
    {
      id: "goals",
      title: "Weekly Goals",
      description:
        "The Goals tab shows your weekly targets for different activities. These help you stay consistent and build healthy habits.",
      target: "[data-tutorial='goals-tab']",
      highlight: true,
      action: "Click on 'Goals' to see your weekly targets",
    },
    {
      id: "complete",
      title: "Progress Tracking Pro! 🏆",
      description:
        "Use this dashboard regularly to stay motivated and track your wellness journey. Celebrate every small win - they all add up!",
    },
  ],

  activities: [
    {
      id: "welcome",
      title: "Welcome to All Activities! 🎯",
      description:
        "This is your comprehensive hub for all wellness tools and activities. Let's explore what's available to support your mental health journey.",
    },
    {
      id: "search-filter",
      title: "Search & Filter",
      description:
        "Use the search bar to find specific activities or filter by category. This helps you quickly find the right tool for your current needs.",
      target: "[data-tutorial='search-filter']",
      highlight: true,
    },
    {
      id: "activity-cards",
      title: "Activity Cards",
      description:
        "Each card shows detailed information about an activity including features, estimated time, and benefits. The color coding helps you identify different types of wellness tools.",
      target: "[data-tutorial='activity-cards']",
      highlight: true,
    },
    {
      id: "time-estimate",
      title: "Time Planning",
      description:
        "Every activity shows an estimated time commitment so you can plan your wellness practice around your schedule.",
      target: "[data-tutorial='time-estimate']",
      highlight: true,
    },
    {
      id: "start-activity",
      title: "Getting Started",
      description:
        "Click 'Start Activity' on any card to begin. Each activity has its own guided experience to help you get the most benefit.",
      target: "[data-tutorial='start-activity']",
      highlight: true,
      action: "Try clicking on a 'Start Activity' button to explore!",
    },
    {
      id: "complete",
      title: "You're Ready to Explore! 🌟",
      description:
        "Start with activities that interest you most. Remember, consistency is more important than perfection. Your mental wellness journey is unique to you!",
    },
  ],

  dashboard: [
    {
      id: "welcome",
      title: "Welcome to MindfulMe! 🌟",
      description:
        "This is your personal wellness dashboard. Let's take a quick tour to help you get started on your mental health journey.",
    },
    {
      id: "profile",
      title: "Your Profile",
      description:
        "This shows your current wellness level, points, and streak. Click on your avatar to access profile settings and account options.",
      target: "[data-tutorial='profile-card']",
      highlight: true,
    },
    {
      id: "quick-actions",
      title: "Quick Actions",
      description:
        "These are your main wellness tools. Start with 'Track Mood' to log how you're feeling, or try 'Breathing Exercises' for immediate relaxation.",
      target: "[data-tutorial='quick-actions']",
      highlight: true,
      action: "Try clicking on 'Track Mood' to log your first entry",
    },
    {
      id: "daily-progress",
      title: "Daily Progress",
      description: "Track your daily wellness goals here. Consistency is key to building healthy mental health habits!",
      target: "[data-tutorial='daily-progress']",
      highlight: true,
    },
    {
      id: "suggestions",
      title: "Personalized Suggestions",
      description:
        "Get AI-powered recommendations based on your mood patterns and activity. These suggestions adapt to your unique wellness journey.",
      target: "[data-tutorial='suggestions']",
      highlight: true,
    },
    {
      id: "complete",
      title: "You're All Set! 🎉",
      description:
        "Start by tracking your mood or trying a breathing exercise. Remember, small daily actions lead to big improvements in mental wellness. You've got this!",
    },
  ],
}
