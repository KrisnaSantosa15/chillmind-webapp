export interface RecommendationItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  link: string;
  tags?: string[];
  content?: {
    type: "exercise" | "tool" | "article" | "video" | "audio";
    instructions?: string;
    steps?: Array<{
      title: string;
      description: string;
    }>;
    duration?: string;
    materials?: string[];
    mediaUrl?: string;
    articleText?: string;
    toolUrl?: string;
    additionalResources?: Array<{
      title: string;
      description: string;
      url: string;
    }>;
  };
}

type AnxietyLevel =
  | "Minimal Anxiety"
  | "Mild Anxiety"
  | "Moderate Anxiety"
  | "Severe Anxiety";

type DepressionLevel =
  | "Minimal Depression"
  | "Mild Depression"
  | "Moderate Depression"
  | "Moderately Severe Depression"
  | "Severe Depression";

type StressLevel = "Low Stress" | "Moderate Stress" | "High Perceived Stress";

export interface RecommendationsData {
  anxiety: {
    [key in AnxietyLevel]: RecommendationItem[];
  };
  depression: {
    [key in DepressionLevel]: RecommendationItem[];
  };
  stress: {
    [key in StressLevel]: RecommendationItem[];
  };
}

export const recommendationsData: RecommendationsData = {
  anxiety: {
    "Minimal Anxiety": [
      {
        id: "anx-min-1",
        title: "Mindful Breathing",
        description: "5-minute breathing exercise to maintain calm and focus",
        icon: "lungs",
        color: "indigo",
        link: "/dashboard/resources/mindful-breathing",
        tags: ["relaxation", "quick", "beginner"],
        content: {
          type: "exercise",
          instructions:
            "This simple breathing technique can help you stay centered and manage feelings of anxiety. It only takes 5 minutes and can be practiced anywhere, at any time.",
          duration: "5 minutes",
          steps: [
            {
              title: "Find a comfortable position",
              description:
                "Sit or lie down in a comfortable position. If sitting, keep your back straight and shoulders relaxed.",
            },
            {
              title: "Begin with awareness",
              description:
                "Close your eyes if comfortable, and bring awareness to your body and breath without trying to change anything.",
            },
            {
              title: "Count your breaths",
              description:
                "Breathe in slowly through your nose for a count of 4, feeling your abdomen expand.",
            },
            {
              title: "Hold briefly",
              description: "Hold your breath gently for a count of 1-2.",
            },
            {
              title: "Exhale slowly",
              description:
                "Exhale slowly through your mouth for a count of 6, feeling your abdomen contract.",
            },
            {
              title: "Continue the pattern",
              description:
                "Repeat this breathing pattern for 5 minutes, focusing your attention on the sensation of breathing.",
            },
          ],
          additionalResources: [
            {
              title: "Breathing Techniques Audio Guide",
              description: "A guided audio recording of this exercise",
              url: "/resources/audio/mindful-breathing-guide.mp3",
            },
            {
              title: "Science Behind Breathing Exercises",
              description:
                "Learn about the physiological benefits of controlled breathing",
              url: "/resources/articles/breathing-science.html",
            },
          ],
        },
      },
      {
        id: "anx-min-2",
        title: "Nature Walk",
        description: "Short outdoor walk to reduce mild tension",
        icon: "person-walking",
        color: "green",
        link: "/dashboard/resources/nature-walk",
        tags: ["outdoor", "relaxation", "physical"],
        content: {
          type: "exercise",
          instructions:
            "Walking in natural environments has been shown to reduce stress and anxiety. This simple activity combines gentle exercise with mindfulness to help calm your mind and relax your body.",
          duration: "15-20 minutes",
          steps: [
            {
              title: "Prepare",
              description:
                "Wear comfortable clothing and shoes suitable for walking. Choose a green space like a park, garden, or wooded area if possible.",
            },
            {
              title: "Set an intention",
              description:
                "Before starting, set an intention to be present during your walk. Decide to leave your worries behind for this short time.",
            },
            {
              title: "Start slowly",
              description:
                "Begin walking at a comfortable, relaxed pace. Let your arms swing naturally and breathe normally.",
            },
            {
              title: "Engage your senses",
              description:
                "Notice what you can see, hear, smell, and feel. Look for interesting plants, listen for birds, feel the breeze on your skin.",
            },
            {
              title: "Focus on your steps",
              description:
                "Pay attention to the sensation of your feet touching the ground. Feel the rhythm of your walking.",
            },
            {
              title: "Practice gratitude",
              description:
                "As you walk, think of things in nature that you appreciate. Express gratitude for this time outdoors.",
            },
            {
              title: "Return mindfully",
              description:
                "As you finish your walk, acknowledge how you feel. Carry this sense of calm with you for the rest of your day.",
            },
          ],
          articleText:
            "Nature walks combine the benefits of physical activity with the restorative effects of natural environments. Research shows that even brief exposure to natural settings can lower stress hormones, reduce rumination, and improve mood.\n\nThe combination of gentle movement and natural surroundings helps activate your parasympathetic nervous system (your 'rest and digest' response), counteracting the effects of stress and anxiety.",
          additionalResources: [
            {
              title: "Nature Walk Meditation Audio Guide",
              description: "A guided audio companion for your nature walks",
              url: "/resources/audio/guided-nature-walk.mp3",
            },
            {
              title: "Finding Green Spaces Near You",
              description:
                "Tools to locate parks and natural areas in your neighborhood",
              url: "/resources/articles/finding-green-spaces.html",
            },
          ],
        },
      },
    ],
    "Mild Anxiety": [
      {
        id: "anx-mild-1",
        title: "Guided Visualization",
        description: "10-minute imagery exercise to ease worry",
        icon: "cloud",
        color: "blue",
        link: "/dashboard/resources/guided-visualization",
        tags: ["relaxation", "guided", "mental"],
        content: {
          type: "exercise",
          instructions:
            "Guided visualization uses the power of your imagination to create a mental sanctuary that promotes relaxation and reduces anxiety. By focusing on peaceful imagery, you can shift your mind away from worries and into a state of calm.",
          duration: "10 minutes",
          materials: [
            "Quiet, comfortable place to sit or lie down",
            "Optional: relaxing background music",
          ],
          mediaUrl: "/resources/audio/safe-place-visualization.mp3",
          steps: [
            {
              title: "Find a comfortable position",
              description:
                "Sit or lie down in a comfortable position where you won't be disturbed for the next 10 minutes.",
            },
            {
              title: "Begin with deep breathing",
              description:
                "Take three deep breaths, inhaling slowly through your nose and exhaling through your mouth.",
            },
            {
              title: "Imagine your safe place",
              description:
                "Picture a place where you feel completely safe, peaceful, and content. This could be a beach, forest, mountain, or any location real or imagined.",
            },
            {
              title: "Develop the scene",
              description:
                "What do you see in this place? Notice colors, shapes, and movement. What sounds can you hear? Are there any gentle smells or sensations?",
            },
            {
              title: "Engage all your senses",
              description:
                "Feel the temperature on your skin. Is there a breeze? Sunlight? Notice textures and sensations. The more senses you engage, the more real it becomes.",
            },
            {
              title: "Stay present in this space",
              description:
                "Explore your safe place. Allow yourself to enjoy being here, completely safe and at peace. Take time to savor the feelings of calm and security.",
            },
            {
              title: "Return when ready",
              description:
                "When ready to finish, know that you can return to this place anytime. Gradually become aware of your surroundings and open your eyes.",
            },
          ],
          articleText:
            "Guided visualization is a evidence-based technique that helps activate your relaxation response. By creating vivid mental images of peaceful settings, you engage parts of your brain that can help counteract the stress response.\n\nVisualization works because your brain responds to imagined experiences in similar ways to real experiences. When you imagine a calm, safe place, your body releases less stress hormones and your nervous system shifts toward a relaxed state.",
          additionalResources: [
            {
              title: "Downloadable Audio Visualizations",
              description:
                "A collection of guided imagery recordings for different situations",
              url: "/resources/downloads/guided-visualizations.zip",
            },
            {
              title: "Creating Your Perfect Safe Place",
              description:
                "Tips for developing a personalized visualization practice",
              url: "/resources/articles/creating-safe-places.html",
            },
          ],
        },
      },
      {
        id: "anx-mild-2",
        title: "Worry Journal",
        description: "Structured journaling to process anxious thoughts",
        icon: "book",
        color: "amber",
        link: "/dashboard/resources/worry-journal",
        tags: ["journaling", "self-reflection"],
        content: {
          type: "tool",
          instructions:
            "A worry journal helps you recognize patterns in your anxious thinking and gives you a structured way to process these thoughts. Use this tool whenever you notice worries building up.",
          duration: "10-15 minutes",
          steps: [
            {
              title: "Identify your worries",
              description:
                "Write down what you're worried about in specific terms. Be as detailed as possible.",
            },
            {
              title: "Rate your anxiety",
              description:
                "On a scale of 1-10, how anxious does this worry make you feel?",
            },
            {
              title: "Identify cognitive distortions",
              description:
                "Are you catastrophizing, mind-reading, or using black-and-white thinking? Try to identify any thinking patterns.",
            },
            {
              title: "Challenge the thought",
              description:
                "What evidence contradicts this worry? What's a more balanced perspective?",
            },
            {
              title: "Create an action plan",
              description:
                "Is there anything you can do about this worry? If yes, what small step can you take?",
            },
          ],
          articleText:
            "Journaling is a powerful technique supported by research to help manage anxiety. By externalizing your worries onto paper, you create mental space and perspective. Regular journaling practice can help you identify patterns in your thinking and develop more helpful responses to anxious thoughts.\n\nRemember that the goal isn't to eliminate anxiety completely, but to develop a healthier relationship with your anxious thoughts.",
          additionalResources: [
            {
              title: "Worry Journal Template",
              description: "Downloadable PDF template for your worry journal",
              url: "/resources/downloads/worry-journal-template.pdf",
            },
            {
              title: "Common Cognitive Distortions",
              description: "A guide to recognizing unhelpful thought patterns",
              url: "/resources/articles/cognitive-distortions.html",
            },
          ],
        },
      },
    ],
    "Moderate Anxiety": [
      {
        id: "anx-mod-1",
        title: "CBT Thought Record",
        description: "Tool to identify and challenge anxious thoughts",
        icon: "document",
        color: "purple",
        link: "/dashboard/resources/thought-record",
        tags: ["cbt", "therapy", "cognitive"],
        content: {
          type: "tool",
          instructions:
            "The Cognitive Behavioral Therapy (CBT) thought record is an evidence-based tool that helps you identify, evaluate, and respond to anxious thoughts in a systematic way.",
          duration: "15-20 minutes",
          materials: [
            "Pen and paper",
            "Quiet space",
            "15-20 minutes of uninterrupted time",
          ],
          steps: [
            {
              title: "Situation",
              description:
                "Briefly describe the situation or trigger that led to your anxious feelings.",
            },
            {
              title: "Emotions",
              description:
                "Identify and rate (0-100%) the intensity of emotions you felt.",
            },
            {
              title: "Automatic Thoughts",
              description:
                "Write down the thoughts that automatically came to mind in the situation.",
            },
            {
              title: "Evidence For",
              description: "What evidence supports this thought being true?",
            },
            {
              title: "Evidence Against",
              description:
                "What evidence suggests this thought might not be entirely accurate?",
            },
            {
              title: "Alternative Perspective",
              description:
                "Generate a more balanced alternative thought based on all the evidence.",
            },
            {
              title: "Re-rate Emotions",
              description:
                "Rate your emotions again (0-100%) after completing this exercise.",
            },
          ],
          toolUrl: "/tools/interactive-thought-record",
          articleText:
            "Cognitive Behavioral Therapy (CBT) is one of the most well-researched and effective approaches for managing anxiety. The thought record is a cornerstone of CBT practice. By systematically examining your thoughts, you can learn to recognize patterns and develop more balanced thinking habits.\n\nWith regular practice, this skill becomes easier and can significantly reduce anxiety over time. Remember that challenging thoughts doesn't mean forcing yourself to think positively – it's about finding perspectives that account for all available evidence.",
          additionalResources: [
            {
              title: "Printable CBT Thought Record",
              description: "Download a PDF version to use offline",
              url: "/resources/downloads/cbt-thought-record.pdf",
            },
            {
              title: "Understanding Cognitive Distortions",
              description:
                "Learn about common thinking traps that contribute to anxiety",
              url: "/resources/articles/cognitive-distortions.html",
            },
            {
              title: "Video: How to Use a Thought Record",
              description: "A step-by-step video tutorial",
              url: "/resources/videos/thought-record-tutorial.mp4",
            },
          ],
        },
      },
      {
        id: "anx-mod-2",
        title: "Grounding Exercises",
        description: "Techniques to manage escalating anxiety",
        icon: "anchor",
        color: "blue",
        link: "/dashboard/resources/grounding",
        tags: ["panic", "immediate", "techniques"],
        content: {
          type: "exercise",
          instructions:
            "Grounding exercises are powerful tools to help you quickly reconnect with the present moment when anxiety starts to take over. These techniques work by shifting your focus away from worrying thoughts and back to your physical senses and immediate environment.",
          duration: "3-5 minutes",
          steps: [
            {
              title: "5-4-3-2-1 Technique",
              description:
                "Notice 5 things you can SEE, 4 things you can TOUCH, 3 things you can HEAR, 2 things you can SMELL, and 1 thing you can TASTE.",
            },
            {
              title: "Body Scan",
              description:
                "Starting at your toes and moving upward, notice the sensations in each part of your body without judgment.",
            },
            {
              title: "Object Focus",
              description:
                "Pick up any nearby object and examine it in detail. Notice its color, texture, weight, temperature, and any patterns or unique features.",
            },
            {
              title: "Counting Backward",
              description:
                "Count backward from 100 by 7s (100, 93, 86...) which requires concentration and helps interrupt anxious thoughts.",
            },
            {
              title: "Category Game",
              description:
                "Name as many items as you can in a specific category (e.g., animals, cities, foods beginning with the letter S).",
            },
            {
              title: "Physical Grounding",
              description:
                "Press your feet firmly into the ground. Feel the floor supporting you. If seated, notice the chair against your body.",
            },
            {
              title: "Temperature Change",
              description:
                "Hold something cold (like ice) or splash cold water on your face. The temperature change can help interrupt intense emotions.",
            },
          ],
          articleText:
            "Grounding exercises are particularly helpful during panic attacks or when anxiety becomes overwhelming. By deliberately focusing on sensory experiences or mental tasks, you activate parts of your brain that can override the anxiety response.\n\nThese techniques work on the principle of neuroplasticity - your brain's ability to form new pathways. With practice, you can strengthen your ability to shift attention away from anxious thoughts and back to the present moment, making these exercises more effective over time.\n\nKeep in mind that different techniques work for different people. Try several to discover which ones work best for you.",
          additionalResources: [
            {
              title: "Printable Grounding Techniques Card",
              description: "A pocket-sized reminder of key grounding exercises",
              url: "/resources/downloads/grounding-techniques-card.pdf",
            },
            {
              title: "Guided Grounding Audio",
              description:
                "Audio guidance through several grounding techniques",
              url: "/resources/audio/guided-grounding.mp3",
            },
            {
              title: "Emergency Grounding for Panic Attacks",
              description: "Specialized techniques for severe anxiety episodes",
              url: "/resources/articles/emergency-grounding.html",
            },
          ],
        },
      },
    ],
    "Severe Anxiety": [
      {
        id: "anx-sev-1",
        title: "Crisis Support",
        description: "Immediate resources for anxiety attacks",
        icon: "phone",
        color: "red",
        link: "/dashboard/resources/crisis-support",
        tags: ["urgent", "support", "crisis"],
        content: {
          type: "article",
          instructions:
            "If you're experiencing a severe anxiety attack or feeling overwhelmed, these resources can provide immediate support. Remember that help is available, and you don't have to face this alone.",
          articleText:
            "Severe anxiety can sometimes feel overwhelming and even frightening. During these moments, reaching out for support is not just helpful—it's essential.\n\nSevere anxiety symptoms may include:\n• Intense fear or sense of doom\n• Rapid heartbeat or chest pain\n• Difficulty breathing\n• Feeling detached from reality\n• Trembling or shaking\n• Nausea or dizziness\n\nIf you're experiencing these symptoms and they're severe or prolonged, please don't hesitate to reach out to one of the support resources listed below.\n\nRemember: Anxiety attacks are temporary. No matter how intense the feelings are, they will pass. You are not alone, and support is available right now.",
          materials: [
            "Phone (if calling a helpline)",
            "Private, quiet space if possible",
          ],
          additionalResources: [
            {
              title: "National Crisis Textline",
              description:
                "Text HOME to 741741 to connect with a Crisis Counselor",
              url: "https://www.crisistextline.org/",
            },
            {
              title: "Anxiety and Depression Association of America Helpline",
              description: "1-240-485-1001 (information, not a crisis line)",
              url: "https://adaa.org/find-help",
            },
            {
              title: "National Suicide Prevention Lifeline",
              description: "1-800-273-8255 (24/7 support)",
              url: "https://suicidepreventionlifeline.org/",
            },
            {
              title: "Local Emergency Services",
              description:
                "Dial 911 (US) or your local emergency number if you're in immediate danger",
              url: "/resources/articles/when-to-seek-emergency-help.html",
            },
          ],
          toolUrl: "/tools/anxiety-first-aid",
        },
      },
      {
        id: "anx-sev-2",
        title: "DARE Technique",
        description: "Structured method to manage panic attacks",
        icon: "shield",
        color: "orange",
        link: "/dashboard/resources/dare-technique",
        tags: ["emergency", "panic", "technique"],
        content: {
          type: "exercise",
          instructions:
            "The DARE technique is a powerful four-step approach specifically designed to help you move through panic attacks and intense anxiety. Rather than fighting against anxiety, DARE teaches you to face it differently.",
          duration: "5-10 minutes",
          steps: [
            {
              title: "D - Defuse",
              description:
                "Acknowledge your anxious thoughts without fighting them. Tell yourself: 'It's just anxiety. This is just my body's alarm system overreacting. I'm not in danger.'",
            },
            {
              title: "A - Accept",
              description:
                "Allow the anxiety to be present without resistance. Say to yourself: 'I accept these sensations. I don't like them, but they can't harm me. I can feel anxious and still function.'",
            },
            {
              title: "R - Run toward",
              description:
                "Instead of avoiding the feeling, lean into it. Challenge the anxiety by thinking: 'That's it? Is that the worst you've got? I can handle this. Bring it on.'",
            },
            {
              title: "E - Engage",
              description:
                "Redirect your attention to an activity or task. Engage fully with what you're doing or the people around you, rather than remaining focused on the anxiety.",
            },
          ],
          articleText:
            "The DARE technique was developed by anxiety specialist Barry McDonagh and has helped thousands of people manage panic attacks and severe anxiety. What makes DARE different from many other approaches is that it doesn't try to eliminate anxiety or teach you to calm down—instead, it changes your relationship with anxiety.\n\nBy paradoxically accepting and even challenging anxiety, you begin to disarm it. When you stop treating the sensations of anxiety as dangerous, they begin to lose their power over you.\n\nPanic attacks feel terrible but are not dangerous. Your body cannot sustain the intense physiological arousal of a panic attack indefinitely—it will naturally subside. The DARE technique helps you move through this difficult experience more effectively.",
          additionalResources: [
            {
              title: "DARE Technique Audio Guide",
              description:
                "A guided audio version to use during anxious moments",
              url: "/resources/audio/dare-technique-guide.mp3",
            },
            {
              title: "Printable DARE Steps Card",
              description: "A wallet-sized reminder of the DARE steps",
              url: "/resources/downloads/dare-reminder-card.pdf",
            },
            {
              title: "Video Demonstration of DARE",
              description: "See how to apply the DARE technique during panic",
              url: "/resources/videos/dare-technique-demo.mp4",
            },
          ],
          mediaUrl: "/resources/audio/dare-guided-practice.mp3",
        },
      },
    ],
  },

  depression: {
    "Minimal Depression": [
      {
        id: "dep-min-1",
        title: "Mood Boosters",
        description: "Quick activities to sustain positive mood",
        icon: "sun",
        color: "amber",
        link: "/dashboard/resources/mood-boosters",
        tags: ["positive", "quick", "preventative"],
        content: {
          type: "tool",
          instructions:
            "Mood boosters are small, achievable activities that can help lift your mood when you're feeling down. These science-backed micro-interventions can be incorporated into your daily routine to help maintain emotional balance.",
          duration: "5-15 minutes per activity",
          steps: [
            {
              title: "Choose a mood booster",
              description:
                "Look through the list of mood-boosting activities below and select one that appeals to you right now.",
            },
            {
              title: "Set an intention",
              description:
                "Before starting, take a moment to acknowledge how you're feeling and set an intention to be open to experiencing positive emotions.",
            },
            {
              title: "Engage fully",
              description:
                "Commit to being present during the activity. Try to engage with it fully rather than going through the motions.",
            },
            {
              title: "Notice the impact",
              description:
                "After completing the activity, check in with yourself. Has your mood shifted, even slightly? What sensations do you notice in your body?",
            },
            {
              title: "Record your experience",
              description:
                "Keep track of which mood boosters work best for you so you can build a personalized toolkit.",
            },
          ],
          articleText:
            "When you're experiencing low mood, your brain may struggle to generate positive activities on its own. Having a pre-prepared menu of mood-boosting options makes it easier to take positive action even when motivation is low.\n\nMood Boosting Activities:\n\n• Physical: 5-minute dance party, stretching routine, brisk walk around the block, 10 jumping jacks\n\n• Sensory: Take a warm shower/bath, hold something cold (like ice), smell a pleasant scent, listen to an upbeat song\n\n• Social: Text a supportive friend, call a family member, write a thank-you note, smile at someone\n\n• Mental: Read an inspiring quote, watch a funny video clip, recall a happy memory in detail, plan something to look forward to\n\n• Creative: Doodle or color for 5 minutes, rearrange items on your desk, write a haiku, take a creative photograph\n\n• Nurturing: Make a cup of tea, apply hand lotion mindfully, sit in the sunshine for 5 minutes, practice deep breathing\n\nEach of these activities can trigger small releases of neurotransmitters like dopamine and serotonin, which help regulate mood. While they may seem simple, consistency is key—regular practice can help strengthen neural pathways associated with positive emotions.",
          additionalResources: [
            {
              title: "Printable Mood Booster Cards",
              description:
                "Downloadable activity cards to keep handy for low moments",
              url: "/resources/downloads/mood-booster-cards.pdf",
            },
            {
              title: "Mood Tracking Template",
              description:
                "A simple way to track which mood boosters work best for you",
              url: "/resources/downloads/mood-tracker-template.pdf",
            },
            {
              title: "Science of Positive Micro-Interventions",
              description:
                "Learn about the research behind small mood-lifting activities",
              url: "/resources/articles/science-of-micro-interventions.html",
            },
          ],
          toolUrl: "/tools/interactive-mood-booster-selector",
        },
      },
      {
        id: "dep-min-2",
        title: "Gratitude Practice",
        description: "Daily exercise to focus on positives",
        icon: "heart",
        color: "pink",
        link: "/dashboard/resources/gratitude-practice",
        tags: ["mental", "positive", "routine"],
        content: {
          type: "exercise",
          instructions:
            "Gratitude practice is a simple yet powerful exercise that trains your brain to notice and appreciate positive aspects of life. Regular practice can help counteract the negative bias that often accompanies depression and low mood.",
          duration: "5 minutes daily",
          materials: ["Journal or note-taking app", "Pen (if using paper)"],
          steps: [
            {
              title: "Choose a consistent time",
              description:
                "Select a time each day for your gratitude practice. Many people find morning or evening works best to establish a routine.",
            },
            {
              title: "Find a quiet space",
              description:
                "Sit somewhere comfortable where you won't be disturbed for the next few minutes.",
            },
            {
              title: "Reflect on three things",
              description:
                "Think of three specific things you feel grateful for today. They can be small (a warm cup of tea) or significant (a supportive relationship).",
            },
            {
              title: "Write them down",
              description:
                "For each item, write down what it is and why you're grateful for it. Be specific and focus on the feelings it evokes.",
            },
            {
              title: "Savor the feeling",
              description:
                "For each item, take a moment to really feel the gratitude in your body. Notice any warmth, relaxation, or openness that arises.",
            },
            {
              title: "Practice regularly",
              description:
                "Consistency is key. Try to practice daily for at least two weeks to begin noticing benefits.",
            },
          ],
          articleText:
            "Gratitude practice is one of the most well-researched positive psychology interventions. Studies show that regular gratitude practice can lead to:\n\n• Increased positive emotions\n• Improved sleep quality\n• Greater optimism\n• Stronger relationships\n• Reduced symptoms of depression\n\nHow does it work? Your brain has a natural negativity bias—it's designed to notice and remember threats and problems more readily than positive experiences. This was helpful for survival throughout human evolution, but in modern life, it can contribute to negative thought patterns.\n\nGratitude practice helps counterbalance this bias by deliberately directing your attention to positive aspects of your experience. Over time, this creates new neural pathways and makes positive thinking more automatic.\n\nFor maximum benefit, try to focus on different things each day, be specific rather than general, and focus on people and experiences rather than just material possessions.",
          additionalResources: [
            {
              title: "Printable Gratitude Journal Template",
              description: "A structured template for daily gratitude practice",
              url: "/resources/downloads/gratitude-journal-template.pdf",
            },
            {
              title: "Gratitude Meditation Audio",
              description: "A guided meditation focusing on gratitude",
              url: "/resources/audio/gratitude-meditation.mp3",
            },
            {
              title: "Research on Gratitude and Well-being",
              description:
                "Summary of scientific studies on gratitude practice",
              url: "/resources/articles/gratitude-research.html",
            },
          ],
        },
      },
    ],
    "Mild Depression": [
      {
        id: "dep-mild-1",
        title: "Light Exercise",
        description: "Gentle physical activity to lift mood",
        icon: "person-walking",
        color: "green",
        link: "/dashboard/resources/light-exercise",
        tags: ["exercise", "physical", "endorphins"],
        content: {
          type: "exercise",
          instructions:
            "Light physical activity is one of the most effective natural remedies for mild depression. This guide offers accessible exercise options that can help boost your mood through movement, even when motivation is low.",
          duration: "10-20 minutes",
          steps: [
            {
              title: "Start small",
              description:
                "Begin with just 5 minutes of movement. Even this short amount can start releasing mood-enhancing endorphins.",
            },
            {
              title: "Choose an activity",
              description:
                "Select something gentle that feels manageable today. Options include walking, gentle stretching, light dancing, or easy yoga poses.",
            },
            {
              title: "Focus on enjoyment",
              description:
                "Find ways to make the activity pleasant - listen to music, go outdoors, or invite a friend if that helps motivation.",
            },
            {
              title: "Notice your body",
              description:
                "Pay attention to physical sensations as you move - your breathing, the feeling of your feet touching the ground, muscles engaging.",
            },
            {
              title: "Track your mood",
              description:
                "Rate your mood before and after exercise on a scale of 1-10 to help notice the benefits over time.",
            },
            {
              title: "Build gradually",
              description:
                "As it becomes easier, slowly increase duration or intensity, but avoid setting unrealistic expectations.",
            },
          ],
          articleText:
            "The link between exercise and improved mood is supported by extensive research. Physical activity triggers several changes in the brain that can help alleviate depression symptoms:\n\n• Releases endorphins and endocannabinoids, natural mood elevators\n• Reduces immune system chemicals that can worsen depression\n• Increases body temperature, which may have calming effects\n• Stimulates growth of new neural connections\n• Provides distraction from negative thoughts\n• Creates a sense of accomplishment\n\nWhen struggling with depression, intense exercise might feel overwhelming. That's why this resource focuses on gentle, accessible movement. The goal is consistency rather than intensity.\n\nSample Light Exercise Options:\n\n• Walking (indoors or outdoors) for 10 minutes\n• Gentle stretching or basic yoga poses\n• Light dancing to favorite music\n• Tai chi or qigong movements\n• Simple gardening activities\n• Light housework done mindfully\n• Gentle swimming or water movement\n\nRemember that during depression, motivation often follows action, not the other way around. You might not feel like exercising, but often the mood boost comes after you begin moving.",
          mediaUrl: "/resources/videos/gentle-movement-guide.mp4",
          additionalResources: [
            {
              title: "10-Minute Gentle Movement Routine",
              description:
                "A follow-along video with simple, mood-boosting movements",
              url: "/resources/videos/10-minute-movement.mp4",
            },
            {
              title: "Exercise and Depression Research Summary",
              description:
                "Overview of scientific studies on physical activity and mood",
              url: "/resources/articles/exercise-depression-science.html",
            },
            {
              title: "Movement Tracking Calendar",
              description:
                "A printable calendar to track your movement and mood",
              url: "/resources/downloads/movement-tracker.pdf",
            },
          ],
        },
      },
      {
        id: "dep-mild-2",
        title: "Social Engagement",
        description: "Low-pressure ways to connect with others",
        icon: "people-arrows",
        color: "blue",
        link: "/dashboard/resources/social-engagement",
        tags: ["social", "connection", "support"],
        content: {
          type: "tool",
          instructions:
            "Social connection is a powerful antidote to depression, but can feel overwhelming when you're not at your best. This guide offers manageable ways to maintain social connections without overextending yourself.",
          duration: "Varies (5-30 minutes per activity)",
          steps: [
            {
              title: "Assess your energy",
              description:
                "On a scale of 1-10, gauge your current social energy level. This will help you choose an appropriate connection activity.",
            },
            {
              title: "Select a connection option",
              description:
                "Based on your energy level, choose a social activity from the suggestions below that feels manageable today.",
            },
            {
              title: "Set boundaries",
              description:
                "Decide in advance how long you'll engage and what topics you're comfortable discussing. It's okay to keep interactions brief.",
            },
            {
              title: "Practice presence",
              description:
                "During the interaction, try to focus on the present moment rather than worrying about how you're coming across.",
            },
            {
              title: "Reflect afterward",
              description:
                "Notice how you feel after connecting. What went well? What would you do differently next time?",
            },
          ],
          articleText:
            "Depression often creates a challenging cycle: social connection helps alleviate symptoms, but depression makes us withdraw from others. This tool aims to break that cycle with gradual, manageable steps toward meaningful connection.\n\nSocial Connection Options by Energy Level:\n\n• Very Low Energy (1-3):\n  - Send a simple text or emoji to a supportive friend\n  - Comment on a social media post\n  - Send a brief voice message instead of calling\n  - Write an email to someone you care about\n\n• Low-Moderate Energy (4-6):\n  - Have a short phone call with a supportive person\n  - Meet a friend for a brief coffee (30 minutes)\n  - Join an online community discussion\n  - Attend a structured activity where interaction is optional\n\n• Moderate-High Energy (7-10):\n  - Meet a friend for a longer activity\n  - Attend a small gathering with trusted people\n  - Reconnect with someone you've lost touch with\n  - Offer help or support to someone else\n\nResearch shows that even small moments of connection can trigger the release of oxytocin, a hormone that helps counteract the effects of stress and promotes feelings of trust and bonding.\n\nRemember that quality matters more than quantity. A few genuine interactions will do more for your wellbeing than numerous surface-level connections.",
          additionalResources: [
            {
              title: "Conversation Starters for Difficult Days",
              description:
                "Simple prompts for when socializing feels challenging",
              url: "/resources/downloads/conversation-starters.pdf",
            },
            {
              title: "Setting Healthy Social Boundaries",
              description:
                "Guide to maintaining connections without becoming overwhelmed",
              url: "/resources/articles/social-boundaries.html",
            },
            {
              title: "Finding Community Resources",
              description:
                "Directory of supportive groups and community organizations",
              url: "/resources/articles/community-connections.html",
            },
          ],
          toolUrl: "/tools/social-connection-planner",
        },
      },
    ],
    "Moderate Depression": [
      {
        id: "dep-mod-1",
        title: "Thought Reframing",
        description: "CBT tool to challenge negative thoughts",
        icon: "document",
        color: "blue",
        link: "/dashboard/resources/thought-reframing",
        tags: ["cognitive", "worksheet", "thoughts"],
        content: {
          type: "tool",
          instructions:
            "Thought reframing is a core technique from Cognitive Behavioral Therapy (CBT) that helps you identify, challenge, and change depressive thinking patterns. This structured approach can help break the cycle of negative thoughts that maintain depression.",
          duration: "15-20 minutes",
          materials: [
            "Pen and paper or digital device",
            "Quiet, private space",
          ],
          steps: [
            {
              title: "Identify the negative thought",
              description:
                "Write down a specific negative thought you've been experiencing. Be as precise as possible about what you're telling yourself.",
            },
            {
              title: "Identify the thinking trap",
              description:
                "Check if your thought involves any common thinking traps: all-or-nothing thinking, catastrophizing, mind reading, emotional reasoning, or overgeneralization.",
            },
            {
              title: "Examine the evidence",
              description:
                "What facts or evidence actually support this thought? What evidence contradicts it? Try to be objective, as if you were evaluating someone else's thought.",
            },
            {
              title: "Consider alternative perspectives",
              description:
                "How might someone else view this situation? What would you say to a friend having this same thought?",
            },
            {
              title: "Create a balanced thought",
              description:
                "Based on this analysis, write a new thought that is more balanced, realistic, and helpful. It doesn't have to be positive, just more accurate.",
            },
            {
              title: "Notice your feelings",
              description:
                "Observe any shifts in your emotions after working through this process. Rate your distress before and after on a scale of 0-10.",
            },
          ],
          articleText:
            'Depression changes how we interpret events, leading to patterns of thinking that are often negatively biased, rigid, and unhelpful. These distorted thoughts then fuel depressive feelings, creating a cycle that maintains the depression.\n\nThought reframing works by helping you recognize that thoughts are not facts. By examining your thoughts with curiosity and objectivity, you can develop more balanced perspectives that better reflect reality.\n\nCommon Thinking Traps in Depression:\n\n• All-or-nothing thinking: Viewing situations in black-and-white terms ("If I can\'t do it perfectly, I\'ve failed completely")\n\n• Catastrophizing: Assuming the worst possible outcome ("This mistake means I\'ll probably lose my job")\n\n• Mind reading: Assuming you know what others are thinking ("Everyone at the meeting thought I was incompetent")\n\n• Emotional reasoning: Believing something is true because it feels true ("I feel worthless, so I must be worthless")\n\n• Overgeneralizing: Applying one experience to all situations ("I was rejected once, so I\'ll always be rejected")\n\nResearch shows that with regular practice, reframing becomes more automatic and can significantly reduce depressive symptoms. This skill may feel awkward or forced at first, but like any skill, it improves with practice.',
          additionalResources: [
            {
              title: "Printable Thought Record Worksheet",
              description:
                "A structured template for practicing thought reframing",
              url: "/resources/downloads/thought-record-worksheet.pdf",
            },
            {
              title: "Common Cognitive Distortions Guide",
              description:
                "Detailed explanations of thinking traps with examples",
              url: "/resources/articles/cognitive-distortions-guide.html",
            },
            {
              title: "Guided Thought Reframing Audio",
              description:
                "Step-by-step audio guidance through the reframing process",
              url: "/resources/audio/thought-reframing-guide.mp3",
            },
          ],
          toolUrl: "/tools/interactive-thought-reframing",
        },
      },
      {
        id: "dep-mod-2",
        title: "Behavioral Activation",
        description: "Plan to increase rewarding activities",
        icon: "check",
        color: "green",
        link: "/dashboard/resources/behavioral-activation",
        tags: ["behavioral", "evidence-based", "therapy"],
        content: {
          type: "tool",
          instructions:
            "Behavioral Activation is a powerful evidence-based technique for depression that helps break the cycle of withdrawal and inactivity. This structured approach guides you to gradually reintroduce meaningful activities into your life, even when motivation is low.",
          duration: "15-30 minutes for planning; varies for activities",
          materials: [
            "Worksheet or digital tool for tracking",
            "Calendar or planner",
          ],
          steps: [
            {
              title: "Understand the cycle",
              description:
                "Recognize how depression creates a cycle: low mood → decreased activity → fewer positive experiences → lower mood. Behavioral activation aims to break this cycle.",
            },
            {
              title: "Identify valued activities",
              description:
                "List activities that previously brought you pleasure, accomplishment, or meaning. Include small daily tasks, social connections, physical activities, and creative pursuits.",
            },
            {
              title: "Rate activities by difficulty",
              description:
                "Assign a difficulty level (1-10) to each activity based on how challenging it feels right now. This helps create a gradual approach.",
            },
            {
              title: "Schedule specific activities",
              description:
                "Choose 2-3 lower-difficulty activities and schedule them for specific days/times in the coming week. Be very concrete about when and how you'll do them.",
            },
            {
              title: "Prepare for obstacles",
              description:
                "For each planned activity, identify potential barriers and create simple solutions to address them in advance.",
            },
            {
              title: "Track and review",
              description:
                "After attempting each activity, note what happened, how you felt before and after, and what you learned. Use this information to plan the next week's activities.",
            },
            {
              title: "Gradually increase challenge",
              description:
                "As activities become easier, gradually incorporate more challenging ones. The goal is progressive improvement, not perfection.",
            },
          ],
          articleText:
            'Behavioral Activation is based on the understanding that depression is maintained in part by behavioral patterns—specifically, withdrawal from rewarding activities. When depressed, we often stop doing things that previously gave us pleasure, purpose, and accomplishment. This makes sense because depression reduces motivation and energy, but it creates a cycle that deepens the depression.\n\nThis approach works on the principle that action can precede motivation, rather than the other way around. By strategically reintroducing meaningful activities—even when you don\'t "feel like it"—you can improve mood and gradually rebuild a fulfilling life.\n\nBehavioral Activation has strong scientific support. Multiple studies show it to be as effective as other evidence-based treatments for depression, including cognitive therapy and medication.\n\nActivity Categories to Consider:\n\n• Pleasure: Activities that bring enjoyment or positive emotions\n• Mastery: Activities that create a sense of accomplishment or competence\n• Connection: Activities that strengthen relationships and social bonds\n• Values: Activities that align with your personal values and priorities\n• Routine: Basic self-care and daily living activities\n\nRemember that the goal is to follow your plan regardless of mood, treating it as an experiment to collect data about what helps. Success is making the attempt, not how you feel during the activity.',
          additionalResources: [
            {
              title: "Behavioral Activation Workbook",
              description:
                "Comprehensive guide with worksheets and tracking tools",
              url: "/resources/downloads/behavioral-activation-workbook.pdf",
            },
            {
              title: "Activity Ideas by Category",
              description:
                "Extensive list of activities sorted by type and difficulty level",
              url: "/resources/articles/activity-ideas.html",
            },
            {
              title: "Video: How Behavioral Activation Works",
              description:
                "Brief explanation of the science behind this approach",
              url: "/resources/videos/behavioral-activation-explained.mp4",
            },
          ],
          toolUrl: "/tools/activity-scheduling",
        },
      },
    ],
    "Moderately Severe Depression": [
      {
        id: "dep-modsev-1",
        title: "Therapy Options",
        description: "Guide to finding professional support",
        icon: "user-doctor",
        color: "teal",
        link: "/dashboard/resources/therapy-options",
        tags: ["professional", "treatment", "guidance"],
        content: {
          type: "article",
          instructions:
            "When experiencing moderately severe depression, professional support can make a significant difference in recovery. This guide helps you understand different therapy options and how to find appropriate help.",
          articleText:
            "Professional support is a key component of treating moderately severe depression. Research consistently shows that therapy—either alone or in combination with medication—is highly effective for depression. This guide will help you understand your options and take steps toward finding appropriate support.\n\nTherapy Approaches for Depression:\n\n• Cognitive Behavioral Therapy (CBT): Focuses on identifying and changing negative thought patterns and behaviors that contribute to depression. Strong research support, typically 12-16 sessions.\n\n• Interpersonal Therapy (IPT): Addresses relationship issues and communication patterns that may contribute to depression. Particularly effective if your depression is connected to relationship difficulties or life transitions.\n\n• Behavioral Activation: Structured approach to gradually increase engagement in positive activities. Can be delivered in fewer sessions than full CBT.\n\n• Mindfulness-Based Cognitive Therapy (MBCT): Combines CBT techniques with mindfulness practices. Particularly helpful for preventing depression relapse.\n\n• Psychodynamic Therapy: Explores unconscious patterns and past experiences that may contribute to current depression. May be longer-term than other approaches.\n\n• Acceptance and Commitment Therapy (ACT): Focuses on accepting difficult thoughts and feelings while committing to actions aligned with personal values.\n\nFinding a Therapist:\n\n1. Start with referrals: Ask your primary care provider, insurance company, school/university counseling center, or trusted friends for recommendations.\n\n2. Check credentials: Look for licensed mental health professionals (psychologists, counselors, clinical social workers, or psychiatrists).\n\n3. Consider specialization: Seek therapists who specifically mention experience with depression.\n\n4. Verify insurance coverage: Contact potential therapists to confirm they accept your insurance or ask about sliding scale options.\n\n5. Interview potential therapists: Many offer a brief consultation call to discuss their approach and determine fit.\n\n6. Trust your comfort level: The therapeutic relationship is crucial for success. It's okay to try multiple therapists to find the right match.\n\nOnline vs. In-Person Therapy:\nBoth online and in-person therapy can be effective for depression. Online options offer convenience and accessibility, while in-person sessions may provide a stronger sense of connection for some people. Consider your preferences, schedule constraints, and comfort with technology when deciding.",
          additionalResources: [
            {
              title: "Therapy Types Comparison Chart",
              description:
                "Detailed breakdown of different therapy approaches for depression",
              url: "/resources/downloads/therapy-comparison-chart.pdf",
            },
            {
              title: "Questions to Ask a Potential Therapist",
              description:
                "Printable guide to help find the right therapeutic match",
              url: "/resources/downloads/therapist-interview-questions.pdf",
            },
            {
              title: "Low-Cost Therapy Options Guide",
              description:
                "Resources for finding affordable mental health care",
              url: "/resources/articles/affordable-therapy-options.html",
            },
            {
              title: "Online Therapy Platform Comparison",
              description:
                "Review of major teletherapy services with pricing information",
              url: "/resources/articles/online-therapy-comparison.html",
            },
          ],
          toolUrl: "/tools/therapist-finder",
        },
      },
      {
        id: "dep-modsev-2",
        title: "Routine Builder",
        description: "Tool to create a supportive daily structure",
        icon: "calendar",
        color: "blue",
        link: "/dashboard/resources/routine-builder",
        tags: ["structure", "routine", "planning"],
        content: {
          type: "tool",
          instructions:
            "A consistent daily routine can provide essential structure when depression makes it difficult to organize your time. This tool helps you build a supportive routine that balances essential tasks, self-care, and meaningful activities.",
          duration: "30 minutes to create; ongoing implementation",
          materials: [
            "Calendar or planner",
            "Journal or worksheet",
            "Pen or pencil",
          ],
          steps: [
            {
              title: "Assess current patterns",
              description:
                "Note your current sleep schedule, meal times, and any existing routines. Identify both helpful patterns to maintain and disruptive patterns to change.",
            },
            {
              title: "Establish anchor points",
              description:
                "Set consistent wake-up and bedtimes to serve as your primary anchor points. Depression often disrupts sleep, so stabilizing your sleep-wake cycle is a priority.",
            },
            {
              title: "Plan regular meals",
              description:
                "Schedule 3 regular meals at consistent times each day, even if they're simple. These will serve as additional anchor points in your day.",
            },
            {
              title: "Include essential self-care",
              description:
                "Add basic hygiene routines, medication times, and at least 10 minutes of movement or fresh air daily.",
            },
            {
              title: "Incorporate brief pleasant activities",
              description:
                "Schedule at least one small pleasant activity daily (e.g., listening to music, brief nature exposure, messaging a friend).",
            },
            {
              title: "Build in rest and transitions",
              description:
                "Allow buffer time between activities and schedule intentional rest periods rather than pushing until exhaustion.",
            },
            {
              title: "Create visual reminders",
              description:
                "Make your routine visible through a written schedule, phone alerts, or visual cues in your environment.",
            },
            {
              title: "Start small and adjust",
              description:
                "Begin with a minimal sustainable routine and gradually build. Revise as needed based on your energy levels and what's working.",
            },
          ],
          articleText:
            "When depression depletes your energy and motivation, having a structured routine can provide essential scaffolding for your day. A thoughtfully designed routine reduces the need for constant decision-making (which depression makes more difficult) and ensures that essential needs are met consistently.\n\nResearch suggests that routine and structure help regulate biological rhythms that influence mood. By stabilizing your sleep-wake cycle, meal times, and daily activities, you can help regulate your body's internal clock and potentially improve mood stability over time.\n\nPrinciples for an Effective Depression Management Routine:\n\n• Consistency over intensity: A simple routine you can maintain is better than an ambitious one you abandon\n\n• Balance restoration with activation: Include both rest and gentle engagement with life\n\n• Prioritize biological rhythms: Regular sleep, eating, and movement patterns help regulate mood\n\n• Build in pleasant events: Even small positive experiences can gradually improve mood\n\n• Allow for flexibility: Your routine should adapt to your changing energy levels\n\n• Include social connection: Even brief interactions can help counter isolation\n\nCommon Routine-Building Challenges in Depression:\n\n• Low motivation: Start with mini-routines of just 1-2 elements\n\n• Overwhelming fatigue: Build in more rest periods than you think you need\n\n• All-or-nothing thinking: Remember that doing something imperfectly is better than doing nothing\n\n• Inconsistent energy: Have backup plans for low-energy days\n\nYour routine serves as external structure until your internal motivation returns—which it will as your depression begins to lift.",
          additionalResources: [
            {
              title: "Printable Routine Builder Worksheet",
              description:
                "Step-by-step template for creating your personalized routine",
              url: "/resources/downloads/routine-builder-worksheet.pdf",
            },
            {
              title: "Morning and Evening Routine Cards",
              description:
                "Visual reminders for consistent daily start and end routines",
              url: "/resources/downloads/routine-cards.pdf",
            },
            {
              title: "Low Energy Day Backup Plans",
              description: "Modified routines for particularly difficult days",
              url: "/resources/articles/low-energy-routines.html",
            },
            {
              title: "Habit Tracking Templates",
              description: "Simple tools to monitor routine consistency",
              url: "/resources/downloads/habit-trackers.pdf",
            },
          ],
          toolUrl: "/tools/interactive-routine-builder",
        },
      },
    ],
    "Severe Depression": [
      {
        id: "dep-sev-1",
        title: "Crisis Hotlines",
        description: "24/7 support for severe depression",
        icon: "phone",
        color: "red",
        link: "/dashboard/resources/crisis-hotlines",
        tags: ["crisis", "support", "immediate"],
        content: {
          type: "article",
          instructions:
            "If you're experiencing severe depression with thoughts of harming yourself, immediate support is available. This resource provides direct access to crisis services that offer 24/7 professional support.",
          articleText:
            "When you're experiencing severe depression, reaching out for immediate support can be lifesaving. Crisis services are staffed by trained professionals who understand what you're going through and can provide immediate support, guidance, and intervention when needed.\n\nYou deserve support, and help is available right now.\n\nImportant things to know about crisis services:\n\n• They are available 24/7, including holidays\n• You can remain anonymous if you prefer\n• Services are confidential\n• No problem is too big or too small\n• You'll speak with trained crisis counselors\n• They can help even if you're not sure exactly what you need\n• Many offer text and chat options if speaking is difficult\n\nSigns that indicate you should reach out immediately:\n\n• Thoughts of suicide or harming yourself\n• Feeling overwhelmed by intense emotions or hopelessness\n• Feeling unsafe or unable to care for yourself\n• Isolation with no one else to talk to\n• Considering drastic or harmful actions\n• Feeling like you can't go on anymore\n\nRemember: Severe depression can distort your thinking and make problems seem unsolvable. Crisis counselors can help provide perspective and support when your own resources feel depleted. Reaching out is a sign of strength, not weakness.",
          additionalResources: [
            {
              title: "National Suicide Prevention Lifeline",
              description: "Call 988 or 1-800-273-8255 (24/7 support)",
              url: "https://suicidepreventionlifeline.org/",
            },
            {
              title: "Crisis Text Line",
              description:
                "Text HOME to 741741 to connect with a Crisis Counselor",
              url: "https://www.crisistextline.org/",
            },
            {
              title: "International Association for Suicide Prevention",
              description: "Find crisis resources worldwide",
              url: "https://www.iasp.info/resources/Crisis_Centres/",
            },
            {
              title: "When to Go to the Emergency Room",
              description:
                "Guidelines for determining when immediate medical intervention is needed",
              url: "/resources/articles/mental-health-emergency-guidelines.html",
            },
            {
              title: "Supporting Someone in Crisis",
              description:
                "Information for friends and family of someone in crisis",
              url: "/resources/articles/supporting-crisis.html",
            },
          ],
        },
      },
      {
        id: "dep-sev-2",
        title: "Safety Plan",
        description: "Personalized plan for crisis management",
        icon: "shield",
        color: "teal",
        link: "/dashboard/resources/safety-plan",
        tags: ["safety", "planning", "crisis"],
        content: {
          type: "tool",
          instructions:
            "A safety plan is a structured tool that helps you navigate moments of crisis when experiencing severe depression. This step-by-step guide will help you create a personalized plan to reference when you're struggling with overwhelming feelings or thoughts of self-harm.",
          duration: "30-45 minutes to create; keep accessible for ongoing use",
          materials: [
            "Worksheet or digital document",
            "Contact information for supports",
            "List of personal coping strategies",
          ],
          steps: [
            {
              title: "Recognize warning signs",
              description:
                "Identify specific thoughts, emotions, images, situations, and behaviors that indicate a crisis may be developing. These are your personal warning signs that it's time to activate your safety plan.",
            },
            {
              title: "Apply internal coping strategies",
              description:
                "List activities you can do on your own to help distract from difficult thoughts or feelings. Include specific activities that have helped in the past (e.g., taking a shower, going for a walk, practicing deep breathing, listening to specific music).",
            },
            {
              title: "Identify social situations and people",
              description:
                "Note places or social environments that can provide distraction and reduce isolation. Include specific locations (e.g., coffee shop, park, library) that feel safe and accessible.",
            },
            {
              title: "List trusted contacts for assistance",
              description:
                "Identify specific people who can help provide support during a crisis. Include their names, relationship to you, phone numbers, and best times to reach them.",
            },
            {
              title: "List professional and agency contacts",
              description:
                "Compile contact information for mental health professionals, local crisis teams, and national hotlines. Include names, numbers, addresses, and hours of operation.",
            },
            {
              title: "Make the environment safe",
              description:
                "Create a plan to restrict access to potential means of self-harm during crisis periods. This might include asking someone to temporarily hold onto certain items or avoiding specific locations.",
            },
            {
              title: "Identify your reasons for living",
              description:
                "Document personal reasons to continue living and fighting through difficult moments. These can be people, future goals, beliefs, or responsibilities that matter to you.",
            },
            {
              title: "Create an accessible format",
              description:
                "Store your safety plan where you can easily access it during a crisis. Consider both physical copies (wallet card, posted on refrigerator) and digital versions (phone notes, photos).",
            },
          ],
          articleText:
            "A safety plan is an evidence-based tool developed by mental health experts to help individuals navigate through periods of crisis or suicidal thoughts. Unlike a formal contract, a safety plan is a practical, step-by-step resource you can turn to when your thinking is clouded by severe depression.\n\nResearch shows that having a concrete plan in place before a crisis occurs significantly improves outcomes. A safety plan works by:\n\n• Identifying warning signs early, before a crisis escalates\n• Providing predetermined strategies when decision-making is difficult\n• Creating a structured pathway to increasingly intensive levels of support\n• Reducing feelings of isolation and hopelessness\n• Buying time for intense emotional states to pass\n\nYour safety plan should be developed when you're in a relatively calm state, ideally with support from a mental health professional. However, creating a basic version on your own is better than having no plan at all.\n\nRemember that a safety plan is a living document. Review and update it periodically, especially after any crisis events, to reflect what strategies worked well and what needs adjustment.\n\nImportant: If you are currently having thoughts of harming yourself, please call a crisis hotline immediately. In the US, call or text 988, or call 1-800-273-8255 for the National Suicide Prevention Lifeline.",
          additionalResources: [
            {
              title: "Printable Safety Plan Template",
              description:
                "A structured worksheet for creating your safety plan",
              url: "/resources/downloads/safety-plan-template.pdf",
            },
            {
              title: "MY3 Safety Plan App",
              description:
                "Free mobile application for creating and accessing your safety plan",
              url: "https://my3app.org/",
            },
            {
              title: "Crisis Support Resources Directory",
              description:
                "Comprehensive list of support services organized by location",
              url: "/resources/articles/crisis-resources-directory.html",
            },
            {
              title: "How to Support Someone with Suicidal Thoughts",
              description: "Guide for friends and family members",
              url: "/resources/articles/supporting-suicidal-loved-ones.html",
            },
          ],
          toolUrl: "/tools/interactive-safety-plan",
        },
      },
    ],
  },

  stress: {
    "Low Stress": [
      {
        id: "str-low-1",
        title: "Desk Stretches",
        description: "Quick stretches to relieve mild tension",
        icon: "dumbbell",
        color: "blue",
        link: "/dashboard/resources/desk-stretches",
        tags: ["physical", "quick", "tension"],
        content: {
          type: "exercise",
          instructions:
            "These simple stretches can be done right at your desk to relieve physical tension from studying or working. Regular stretch breaks can help reduce stress and prevent muscle tightness from prolonged sitting.",
          duration: "5 minutes",
          steps: [
            {
              title: "Neck Release",
              description:
                "Sit tall and slowly drop your right ear toward your right shoulder. Hold for 30 seconds, feeling the stretch along the left side of your neck. Repeat on the other side.",
            },
            {
              title: "Shoulder Rolls",
              description:
                "Roll your shoulders backward in a circular motion 5 times, then forward 5 times. Focus on creating the largest circles possible.",
            },
            {
              title: "Wrist and Finger Stretch",
              description:
                "Extend one arm with palm facing forward, as if signaling 'stop'. Use your other hand to gently pull fingers back toward your body. Hold for 15-30 seconds, then switch hands.",
            },
            {
              title: "Seated Twist",
              description:
                "Sit tall with feet flat on the floor. Place your right hand on your left knee and your left hand behind you on the seat. Gently twist to the left, looking over your left shoulder. Hold for 30 seconds, then switch sides.",
            },
            {
              title: "Upper Back Stretch",
              description:
                "Interlace fingers and push palms forward, rounding upper back. Hold for 15-30 seconds while taking deep breaths.",
            },
            {
              title: "Eye Relief",
              description:
                "Rub hands together until warm, then place palms gently over closed eyes. Hold for 30 seconds while breathing deeply, giving your eyes a break from screens.",
            },
          ],
          articleText:
            "Prolonged sitting and screen time create physical tension that can amplify stress. When we're under stress, we tend to hold tension in our bodies—particularly in the neck, shoulders, and back. This physical tension can then feed back into our stress response, creating a cycle.\n\nBy incorporating brief stretch breaks into your study or work routine, you can interrupt this cycle. These simple movements help:\n\n• Release muscle tension\n• Improve circulation\n• Increase oxygen flow to the brain\n• Provide a mental reset\n• Reduce eye strain\n• Prevent repetitive stress injuries\n\nFor maximum benefit, try to take a brief stretch break every 30-45 minutes. Set a gentle timer to remind yourself until it becomes a habit.\n\nThese stretches are designed to be unobtrusive and can be done in any environment without drawing attention. Focus on smooth, gentle movements rather than forcing or bouncing in stretches.",
          mediaUrl: "/resources/videos/desk-stretches-demo.mp4",
          additionalResources: [
            {
              title: "Printable Desk Stretch Reminder",
              description: "A visual guide to keep at your workspace",
              url: "/resources/downloads/desk-stretch-guide.pdf",
            },
            {
              title: "Extended Stretching Routine",
              description:
                "A 10-minute comprehensive stretch routine for longer breaks",
              url: "/resources/videos/extended-stretch-routine.mp4",
            },
            {
              title: "Ergonomic Workspace Setup",
              description:
                "Guide to setting up your workspace to prevent tension",
              url: "/resources/articles/ergonomic-workspace.html",
            },
          ],
        },
      },
      {
        id: "str-low-2",
        title: "Workspace Optimization",
        description: "Tips to create a low-stress study space",
        icon: "home",
        color: "purple",
        link: "/dashboard/resources/workspace-optimization",
        tags: ["environment", "productivity"],
        content: {
          type: "article",
          instructions:
            "Your physical environment can significantly impact your stress levels and productivity. This guide offers research-backed strategies to optimize your study or work space to reduce stress and enhance focus.",
          articleText:
            'Your workspace directly influences your mental state, stress levels, and productivity. Even small changes to your environment can have a significant impact on how you feel and perform during study or work sessions.\n\nKey Principles for a Low-Stress Workspace:\n\n1. Minimize Distractions\n• Position your desk away from high-traffic areas\n• Use noise-cancelling headphones or background sounds that enhance focus\n• Consider a "do not disturb" sign or system during focused work periods\n• Keep your phone out of sight or use app blockers during study sessions\n• Clear visual distractions from your immediate work area\n\n2. Optimize Physical Comfort\n• Ensure proper ergonomics: chair height, screen position, keyboard placement\n• Maintain good lighting to reduce eye strain (natural light is ideal when available)\n• Keep temperature comfortable (slightly cool temperatures often enhance alertness)\n• Have water accessible to stay hydrated\n• Consider a standing desk option or alternative seating for variation\n\n3. Incorporate Nature Elements\n• Add a small plant to your workspace (even artificial plants can provide benefits)\n• Position your desk to see outside if possible\n• Use nature sounds as background noise\n• Display nature images or use nature scenes as your desktop background\n\n4. Create Visual Order\n• Declutter regularly using the "everything has a home" principle\n• Use vertical space with shelving to maximize limited space\n• Implement a simple filing system for papers and materials\n• Bundle and organize cables to reduce visual chaos\n• Clear your workspace at the end of each day\n\n5. Add Personalization & Positive Cues\n• Include small meaningful objects that bring you joy or motivation\n• Use color strategically (blues and greens tend to be calming)\n• Keep visual reminders of your goals and achievements\n• Display inspiring quotes or affirmations\n• Create boundaries between work/study space and relaxation space\n\nRemember that the ideal workspace varies from person to person. Experiment with these elements to discover what combination best supports your focus and wellbeing.',
          additionalResources: [
            {
              title: "Workspace Assessment Checklist",
              description:
                "A printable tool to evaluate your current workspace",
              url: "/resources/downloads/workspace-assessment.pdf",
            },
            {
              title: "Budget-Friendly Workspace Improvements",
              description: "Low-cost ways to enhance your study environment",
              url: "/resources/articles/budget-workspace-improvements.html",
            },
            {
              title: "Virtual Workspace Tour",
              description: "Video examples of optimized student workspaces",
              url: "/resources/videos/workspace-examples.mp4",
            },
          ],
        },
      },
    ],
    "Moderate Stress": [
      {
        id: "str-mod-1",
        title: "Stress Journal",
        description: "Prompts to uncover stress triggers",
        icon: "book",
        color: "teal",
        link: "/dashboard/resources/stress-journal",
        tags: ["journaling", "awareness", "triggers"],
        content: {
          type: "tool",
          instructions:
            "A stress journal helps you identify patterns in your stress response, recognize early warning signs, and develop more effective coping strategies. By bringing awareness to your stress triggers and responses, you gain insight and control.",
          duration: "10-15 minutes",
          materials: [
            "Notebook or digital journaling app",
            "Quiet space",
            "Pen",
          ],
          steps: [
            {
              title: "Create an entry structure",
              description:
                "For each journal entry, include the date, time, situation, stress level (1-10), physical sensations, thoughts, emotions, and coping responses.",
            },
            {
              title: "Record the situation",
              description:
                "Describe the event or situation that triggered stress. Include who was involved, what happened, when and where it occurred.",
            },
            {
              title: "Note your stress signals",
              description:
                "Document how your body responded (tight chest, racing heart, tension headache, etc.) and any emotional reactions (irritation, worry, overwhelm).",
            },
            {
              title: "Identify your thoughts",
              description:
                "What went through your mind during this stressful situation? Record your thoughts without judgment or censoring.",
            },
            {
              title: "Reflect on your response",
              description:
                "How did you cope with the stress? What helped? What might have worked better? Be honest but compassionate with yourself.",
            },
            {
              title: "Look for patterns",
              description:
                "After several entries, review your journal to identify recurring triggers, thoughts, or reactions. Notice what coping strategies seem most effective.",
            },
          ],
          articleText:
            "Stress journaling is a powerful tool for breaking the automatic stress cycle. Many of our stress reactions happen unconsciously—we move from trigger to full stress response without awareness of the steps between. This journal helps you slow down this process and insert conscious awareness.\n\nBy documenting your stress experiences, you can:\n\n• Identify specific stress triggers you might otherwise miss\n• Recognize early warning signs before stress escalates\n• Discover patterns in your stress response\n• Evaluate the effectiveness of different coping strategies\n• Track your progress over time\n\nJournal Prompts for Deeper Exploration:\n\n• What aspects of this situation were within my control? Which weren't?\n• What need of mine wasn't being met in this situation?\n• What would I say to a friend experiencing this same stressor?\n• How might this situation look from another perspective?\n• What resources or support might help me handle similar situations in the future?\n\nBe patient with this process. Stress journaling isn't about eliminating stress entirely—it's about developing a more conscious relationship with your stress response. With practice, you'll likely notice earlier warning signs and have more choice in how you respond to stressors.",
          additionalResources: [
            {
              title: "Printable Stress Journal Template",
              description: "A structured template for tracking stress patterns",
              url: "/resources/downloads/stress-journal-template.pdf",
            },
            {
              title: "Common Stress Triggers and Solutions",
              description: "Reference guide for addressing frequent stressors",
              url: "/resources/articles/common-stress-triggers.html",
            },
            {
              title: "Video: Getting Started with Stress Journaling",
              description: "A walkthrough of effective journaling practices",
              url: "/resources/videos/stress-journal-guide.mp4",
            },
          ],
          toolUrl: "/tools/interactive-stress-journal",
        },
      },
      {
        id: "str-mod-2",
        title: "Body Scan Meditation",
        description: "Guided meditation to release stress",
        icon: "brain",
        color: "indigo",
        link: "/dashboard/resources/body-scan",
        tags: ["relaxation", "guided", "mental"],
        content: {
          type: "exercise",
          instructions:
            "The body scan meditation is a powerful technique for reducing stress by bringing awareness to physical sensations throughout your body. This practice helps release tension you may not even realize you're holding and promotes a state of deep relaxation.",
          duration: "10-15 minutes",
          materials: [
            "Comfortable place to sit or lie down",
            "Optional: meditation cushion or yoga mat",
          ],
          steps: [
            {
              title: "Find a comfortable position",
              description:
                "Lie down on your back or sit in a comfortable position where you won't be disturbed. Close your eyes if that feels comfortable.",
            },
            {
              title: "Take a few deep breaths",
              description:
                "Breathe deeply into your abdomen, allowing your body to begin relaxing with each exhale.",
            },
            {
              title: "Bring awareness to your feet",
              description:
                "Notice any sensations in your toes, the soles of your feet, the tops of your feet, and your ankles. Observe without judgment.",
            },
            {
              title: "Slowly move up through your body",
              description:
                "Gradually shift your attention up through your legs, pelvis, abdomen, chest, back, hands, arms, shoulders, neck, and finally your head.",
            },
            {
              title: "Notice areas of tension",
              description:
                "When you encounter areas of tension or discomfort, breathe into them. Imagine the breath flowing directly to that area.",
            },
            {
              title: "Practice letting go",
              description:
                "As you exhale, imagine releasing the tension in that area. You don't need to force relaxation—simply bringing awareness often allows tension to dissolve.",
            },
            {
              title: "Complete the practice",
              description:
                "When you've scanned your entire body, spend a few moments being aware of your body as a whole, feeling the sensations of your entire body breathing.",
            },
          ],
          articleText:
            "The body scan meditation is a cornerstone practice in mindfulness-based stress reduction (MBSR), a clinically proven approach to managing stress. This technique helps bridge the mind-body connection that's often disrupted during stress.\n\nWhen we're stressed, we tend to disconnect from physical sensations as our attention becomes consumed by worried thoughts. This disconnect can lead to chronic muscle tension, shallow breathing, and heightened stress hormones—all without our awareness.\n\nBy systematically bringing non-judgmental attention to each part of your body, you:\n\n• Interrupt the stress cycle\n• Release unconscious physical tension\n• Activate your parasympathetic nervous system (rest and digest response)\n• Improve body awareness\n• Create a foundation for responding to stress signals earlier\n\nRegular practice can help you develop the ability to notice stress responses in your body when they first arise, rather than after they've escalated. This early awareness gives you the opportunity to respond skillfully to stressors.\n\nMany beginners find that they fall asleep during this practice, which is completely normal, especially if you're sleep-deprived. As you continue practicing, you'll develop the ability to maintain a state of relaxed awareness.",
          mediaUrl: "/resources/audio/guided-body-scan.mp3",
          additionalResources: [
            {
              title: "Body Scan Meditation Audio (10 minutes)",
              description:
                "A guided recording to lead you through the practice",
              url: "/resources/audio/10min-body-scan.mp3",
            },
            {
              title: "Body Scan Meditation Audio (20 minutes)",
              description: "A longer version for deeper relaxation",
              url: "/resources/audio/20min-body-scan.mp3",
            },
            {
              title: "The Science of Body Scan Meditation",
              description:
                "Research on how body scanning affects stress physiology",
              url: "/resources/articles/body-scan-research.html",
            },
          ],
        },
      },
    ],
    "High Perceived Stress": [
      {
        id: "str-high-1",
        title: "Burnout Recovery",
        description: "Plan to address and recover from burnout",
        icon: "fire",
        color: "orange",
        link: "/dashboard/resources/burnout-recovery",
        tags: ["burnout", "recovery", "self-care"],
        content: {
          type: "tool",
          instructions:
            "Burnout is a state of chronic stress that leads to physical and emotional exhaustion, cynicism, and feelings of ineffectiveness. This structured recovery plan helps you recognize burnout symptoms and take specific steps toward healing and prevention.",
          duration: "30 minutes for initial assessment; ongoing implementation",
          steps: [
            {
              title: "Recognize burnout symptoms",
              description:
                "Assess yourself for key burnout symptoms: exhaustion (feeling depleted), cynicism (negative attitude), and inefficacy (reduced sense of accomplishment). Rate each from 1-10.",
            },
            {
              title: "Identify contributing factors",
              description:
                "Examine which areas are contributing most to your burnout: workload, control issues, lack of recognition, poor community, unfairness, or value conflicts.",
            },
            {
              title: "Create immediate relief strategies",
              description:
                "Establish 2-3 immediate actions for relief, such as setting boundaries, requesting extensions, taking time off, or delegating tasks.",
            },
            {
              title: "Restore physical resources",
              description:
                "Prioritize sleep, nutrition, and physical activity. Create a specific plan for improving at least one of these areas this week.",
            },
            {
              title: "Address emotional depletion",
              description:
                "Schedule daily micro-recovery periods (5-15 minutes) for activities that replenish your emotional reserves, like meditation, nature exposure, or creative expression.",
            },
            {
              title: "Evaluate and adjust demands",
              description:
                "List all your current commitments and responsibilities. Identify what can be eliminated, postponed, delegated, or renegotiated.",
            },
            {
              title: "Build ongoing prevention habits",
              description:
                "Commit to 1-2 sustainable practices that will help prevent future burnout, such as regular breaks, setting boundaries, or scheduled self-assessment.",
            },
          ],
          articleText:
            "Burnout isn't simply being tired or stressed—it's a specific psychological condition resulting from chronic workplace or academic stress that hasn't been successfully managed. According to research, burnout has three key dimensions:\n\n• Exhaustion: Feeling overextended and depleted of emotional and physical resources\n• Cynicism: Mental distance from your work or studies, or feelings of negativity or cynicism related to your work\n• Inefficacy: Reduced professional efficacy and accomplishment\n\nBurnout recovery requires addressing both immediate symptoms and underlying causes. This process involves creating space for recovery while simultaneously addressing the factors that led to burnout.\n\nCommon Burnout Contributors:\n\n• Excessive workload: Too many demands and too few resources\n• Lack of control: Minimal autonomy in decisions affecting your work\n• Insufficient reward: Lack of recognition or satisfaction\n• Breakdown of community: Isolation or unresolved conflicts\n• Absence of fairness: Inequity or perceived unfairness\n• Value conflicts: Disconnect between personal values and requirements\n\nRecovery Timeline:\nBe patient with this process. Meaningful burnout recovery typically takes weeks or months, not days. The more severe and prolonged your burnout, the longer recovery may take. Small, consistent actions are more sustainable than dramatic changes.",
          additionalResources: [
            {
              title: "Burnout Self-Assessment Tool",
              description: "Comprehensive assessment to gauge burnout severity",
              url: "/resources/downloads/burnout-assessment.pdf",
            },
            {
              title: "Boundary Setting Workshop",
              description:
                "Interactive guide for establishing healthy boundaries",
              url: "/resources/videos/boundary-setting-workshop.mp4",
            },
            {
              title: "Micro-Recovery Activities Guide",
              description:
                "50+ quick activities to restore energy throughout the day",
              url: "/resources/articles/micro-recovery-activities.html",
            },
            {
              title: "When to Seek Professional Help for Burnout",
              description:
                "Guidelines for determining when additional support is needed",
              url: "/resources/articles/burnout-professional-help.html",
            },
          ],
          toolUrl: "/tools/burnout-recovery-planner",
        },
      },
      {
        id: "str-high-2",
        title: "Stress Management Toolkit",
        description: "Comprehensive strategies for high stress",
        icon: "document",
        color: "teal",
        link: "/dashboard/resources/stress-toolkit",
        tags: ["comprehensive", "techniques", "workbook"],
        content: {
          type: "tool",
          instructions:
            "This comprehensive toolkit provides a collection of evidence-based techniques to manage high levels of stress. Rather than relying on a single approach, the toolkit helps you build a personalized stress management strategy by combining multiple techniques based on your specific needs.",
          duration: "Varies by technique (5-30 minutes per exercise)",
          articleText:
            "Effective stress management typically requires a multi-faceted approach. This toolkit organizes research-backed techniques into five key categories, allowing you to create a comprehensive stress management plan tailored to your specific situation and preferences.\n\n1. Physical Techniques\n• Progressive Muscle Relaxation: Systematically tense and release muscle groups to reduce physical tension\n• Diaphragmatic Breathing: Slow, deep breathing that activates the parasympathetic nervous system\n• Physical Exercise: Even brief activity sessions release tension and produce endorphins\n• Power Posing: Adopting expansive body postures that can reduce stress hormones\n\n2. Mental Techniques\n• Cognitive Restructuring: Identify and challenge stress-inducing thought patterns\n• Worry Time: Designate specific time to address worries, reducing rumination throughout the day\n• Mental Distancing: Observe thoughts without attachment using mindfulness principles\n• Positive Reframing: Find alternative perspectives on stressful situations\n\n3. Emotional Regulation\n• Emotional Awareness Practice: Develop ability to identify and name emotions with precision\n• Self-Compassion Exercise: Treat yourself with the kindness you'd offer a good friend\n• Emotional Expression: Healthy outlets for processing difficult emotions\n• Positive Emotion Cultivation: Intentionally generate positive emotional states\n\n4. Behavioral Strategies\n• Time Management Techniques: Methods for organizing tasks and reducing time pressure\n• Boundary Setting: Scripts and strategies for establishing healthy limitations\n• Strategic Breaks: Structured approach to restorative pauses throughout the day\n• Sleep Hygiene: Practices that improve sleep quality and stress resilience\n\n5. Social Support\n• Support Mapping: Identify and strengthen your social support network\n• Effective Communication: Express needs and feelings constructively during stress\n• Asking for Help: Overcome barriers to seeking appropriate support\n• Connection Practices: Simple ways to boost social connection even when busy\n\nThe most effective approach to stress management is personalized and multi-modal. This toolkit allows you to experiment with different techniques and build a tailored stress management plan that addresses your specific stress profile.",
          additionalResources: [
            {
              title: "Stress Management Workbook",
              description:
                "Comprehensive guide with detailed instructions for all toolkit components",
              url: "/resources/downloads/stress-management-workbook.pdf",
            },
            {
              title: "Stress Profiling Assessment",
              description:
                "Personalized assessment to identify your unique stress patterns",
              url: "/tools/stress-profile-assessment",
            },
            {
              title: "Weekly Stress Management Planner",
              description:
                "Template for scheduling and tracking your stress management practices",
              url: "/resources/downloads/stress-management-planner.pdf",
            },
            {
              title: "Mini-Modules Video Series",
              description:
                "Short instructional videos for each stress management technique",
              url: "/resources/videos/stress-technique-series.html",
            },
          ],
          toolUrl: "/tools/interactive-stress-toolkit",
        },
      },
    ],
  },
};

export function getSampleRecommendations(
  count: number = 3
): RecommendationItem[] {
  const samples: RecommendationItem[] = [
    {
      ...recommendationsData.anxiety["Mild Anxiety"][0],
      content: recommendationsData.anxiety["Mild Anxiety"][0].content
        ? {
            ...recommendationsData.anxiety["Mild Anxiety"][0].content!,
            type: recommendationsData.anxiety["Mild Anxiety"][0].content!
              .type as "exercise" | "tool" | "article" | "video" | "audio",
          }
        : undefined,
    },
    {
      ...recommendationsData.depression["Moderate Depression"][0],
      content: recommendationsData.depression["Moderate Depression"][0].content
        ? {
            ...recommendationsData.depression["Moderate Depression"][0]
              .content!,
            type: recommendationsData.depression["Moderate Depression"][0]
              .content!.type as
              | "exercise"
              | "tool"
              | "article"
              | "video"
              | "audio",
          }
        : undefined,
    },
    {
      ...recommendationsData.stress["Moderate Stress"][1],
      content: recommendationsData.stress["Moderate Stress"][1].content
        ? {
            ...recommendationsData.stress["Moderate Stress"][1].content!,
            type: recommendationsData.stress["Moderate Stress"][1].content!
              .type as "exercise" | "tool" | "article" | "video" | "audio",
          }
        : undefined,
    },
  ];

  return samples.slice(0, count);
}
