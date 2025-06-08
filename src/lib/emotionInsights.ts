import { Emotion } from "@/lib/journalStorage";
import { User } from "firebase/auth";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, updateDoc, collection } from "firebase/firestore";

export type InsightLevel = "basic" | "intermediate" | "advanced";

export interface EmotionInsight {
  title: string;
  description: string;
  copingStrategy: string;
  reflectionPrompt: string;
  factoid?: string;
}

export const getEmotionInsight = async (
  emotion: Emotion,
  user: User
): Promise<EmotionInsight> => {
  const count = await getEmotionCount(user, emotion);

  let level: InsightLevel = "basic";
  if (count > 5) level = "intermediate";
  if (count > 10) level = "advanced";

  await incrementEmotionCount(user, emotion);

  return getInsightContent(emotion, level);
};

const getInsightContent = (
  emotion: Emotion,
  level: InsightLevel
): EmotionInsight => {
  switch (emotion) {
    case "joy":
      if (level === "basic") {
        return {
          title: "Understanding Joy",
          description:
            "Your brain is releasing dopamine and serotonin, creating feelings of pleasure and satisfaction.",
          copingStrategy:
            "Savor this moment. Try to be fully present and mindful of the positive emotions you're experiencing.",
          reflectionPrompt:
            "What specific aspects of this experience brought you joy?",
        };
      } else if (level === "intermediate") {
        return {
          title: "The Science of Joy",
          description:
            "Joy activates your brain's reward pathways, reducing stress hormones like cortisol while enhancing immune function.",
          copingStrategy:
            "Create a joy journal entry highlighting three specific moments from today that made you happy.",
          reflectionPrompt:
            "How might you recreate similar positive experiences in the future?",
        };
      } else {
        return {
          title: "Cultivating Lasting Joy",
          description:
            "Regular experiences of joy create neural pathways that make it easier to access positive emotions, even during difficult times.",
          copingStrategy:
            "Share your joy with someone else - research shows that shared positive experiences amplify happiness.",
          reflectionPrompt:
            "What personal strengths helped you create or notice this joyful experience?",
          factoid:
            "Studies show that people who regularly experience joy live up to 7 years longer than those who don't.",
        };
      }

    case "love":
      if (level === "basic") {
        return {
          title: "Understanding Connection",
          description:
            "Your brain is releasing oxytocin, often called the 'love hormone,' which promotes bonding and trust.",
          copingStrategy:
            "Express your appreciation to someone you care about, even in a small way.",
          reflectionPrompt:
            "How does this feeling of connection influence your overall wellbeing?",
        };
      } else if (level === "intermediate") {
        return {
          title: "The Power of Attachment",
          description:
            "Feeling love and connection activates the parasympathetic nervous system, promoting relaxation and healing.",
          copingStrategy:
            "Practice loving-kindness meditation by sending good wishes to yourself and others.",
          reflectionPrompt:
            "What qualities do you appreciate most in your meaningful relationships?",
        };
      } else {
        return {
          title: "Building Deeper Connections",
          description:
            "Consistent experiences of love and connection actually change brain structure, enhancing emotional regulation.",
          copingStrategy:
            "Practice active listening with someone important to you without planning your response.",
          reflectionPrompt:
            "How might you cultivate more meaningful connections in your daily life?",
          factoid:
            "Research shows that strong social connections can reduce your risk of premature death by up to 50%.",
        };
      }

    case "surprise":
      if (level === "basic") {
        return {
          title: "The Surprise Response",
          description:
            "Surprise momentarily interrupts your brain's patterns, causing a burst of norepinephrine that enhances attention and curiosity.",
          copingStrategy:
            "Take a moment to fully absorb this unexpected experience before reacting.",
          reflectionPrompt:
            "What assumptions were challenged by this surprising moment?",
        };
      } else if (level === "intermediate") {
        return {
          title: "Learning Through Surprise",
          description:
            "Surprising events create stronger memories because they activate your brain's novelty detectors, enhancing learning.",
          copingStrategy:
            "Challenge yourself to try something new today that might pleasantly surprise you.",
          reflectionPrompt:
            "How has this surprise changed your perspective on what's possible?",
        };
      } else {
        return {
          title: "Embracing the Unexpected",
          description:
            "People who are open to surprise tend to be more creative and adaptable in the face of change.",
          copingStrategy:
            "Deliberately break one small routine today to create space for new experiences.",
          reflectionPrompt:
            "How might you cultivate more openness to surprise in your daily life?",
          factoid:
            "Neuroscience research shows that surprise is essential for learning and memory formation.",
        };
      }

    case "fear":
      if (level === "basic") {
        return {
          title: "Understanding Fear",
          description:
            "Your amygdala has activated your fight-or-flight response, releasing adrenaline to prepare you for action.",
          copingStrategy:
            "Try 4-7-8 breathing: Inhale for 4 seconds, hold for 7, exhale for 8.",
          reflectionPrompt:
            "What small step could you take to address what's causing this fear?",
        };
      } else if (level === "intermediate") {
        return {
          title: "Fear's Purpose",
          description:
            "Fear evolved as a protective mechanism. The physical sensations you feel are your body preparing to respond to perceived threats.",
          copingStrategy:
            "Name your fear specifically. Research shows that labeling emotions reduces their intensity.",
          reflectionPrompt:
            "How has fear protected you in the past? When has it held you back?",
        };
      } else {
        return {
          title: "Mastering Fear",
          description:
            "Chronic fear can create neural pathways that reinforce anxiety. But your brain can form new pathways through consistent practice.",
          copingStrategy:
            "Try 'worry scheduling': Set aside 15 minutes today to focus completely on your fears, then let them go until tomorrow.",
          reflectionPrompt:
            "What would you do differently if you weren't afraid?",
          factoid:
            "The brain cannot distinguish between real and imagined threats, which is why visualization techniques can help overcome fears.",
        };
      }

    case "anger":
      if (level === "basic") {
        return {
          title: "Understanding Anger",
          description:
            "Your body is releasing cortisol and adrenaline, preparing you to defend against a perceived threat or injustice.",
          copingStrategy:
            "Step away briefly if possible and take 10 deep breaths before responding.",
          reflectionPrompt:
            "What need or value of yours feels threatened or unmet right now?",
        };
      } else if (level === "intermediate") {
        return {
          title: "Anger as Information",
          description:
            "Anger often signals that something important to us has been violated. It can be a catalyst for positive change when channeled effectively.",
          copingStrategy:
            "Write down what you're angry about, then identify one constructive action you could take.",
          reflectionPrompt: "What is your anger trying to protect or preserve?",
        };
      } else {
        return {
          title: "Transforming Anger",
          description:
            "Chronic anger can damage health by keeping stress hormones elevated. Learning to process anger effectively is crucial for wellbeing.",
          copingStrategy:
            "Practice the 'empty chair' technique: Express your feelings to an empty chair as if the person you're angry with is sitting there.",
          reflectionPrompt:
            "How might you channel this energy into positive change?",
          factoid:
            "Studies show that unexpressed anger correlates with heart disease, while constructively expressed anger can lead to improved relationships.",
        };
      }

    case "sadness":
      if (level === "basic") {
        return {
          title: "Understanding Sadness",
          description:
            "Your brain is processing a loss or disappointment, which can temporarily lower energy levels and motivation.",
          copingStrategy:
            "Be gentle with yourself. Place one hand on your heart and take several slow, deep breaths.",
          reflectionPrompt:
            "What might your sadness be telling you about what matters to you?",
        };
      } else if (level === "intermediate") {
        return {
          title: "The Purpose of Sadness",
          description:
            "Sadness helps us process loss and can deepen our capacity for empathy and connection with others.",
          copingStrategy:
            "Reach out to someone you trust. Simply sharing how you feel can reduce the intensity of sadness.",
          reflectionPrompt:
            "How has experiencing sadness helped you grow or connect with others?",
        };
      } else {
        return {
          title: "Moving Through Sadness",
          description:
            "Allowing yourself to feel sadness fully can actually help it pass more quickly than trying to suppress it.",
          copingStrategy:
            "Express your feelings through a creative outlet like writing, drawing, or music.",
          reflectionPrompt:
            "What comfort or wisdom would you offer to someone else feeling this same sadness?",
          factoid:
            "Research shows that accepting negative emotions without judgment leads to better psychological health than trying to avoid them.",
        };
      }

    case "neutral":
    default:
      if (level === "basic") {
        return {
          title: "Emotional Awareness",
          description:
            "Neutral moments provide a balanced baseline for experiencing the full spectrum of emotions.",
          copingStrategy:
            "Take a moment to scan your body and notice any subtle sensations present.",
          reflectionPrompt:
            "What small adjustments might shift your current state in a positive direction?",
        };
      } else if (level === "intermediate") {
        return {
          title: "Finding Balance",
          description:
            "Neutral emotional states can be an opportunity for reflection and intentional choices about where to direct your energy.",
          copingStrategy:
            "Set an intention for how you'd like to feel in the next few hours.",
          reflectionPrompt:
            "What activities tend to shift you from neutral to positive states?",
        };
      } else {
        return {
          title: "Emotional Equilibrium",
          description:
            "Cultivating a stable neutral baseline helps build resilience when facing both positive and challenging situations.",
          copingStrategy:
            "Practice mindful awareness of your present moment experience without trying to change it.",
          reflectionPrompt:
            "How can you use this neutral state as a foundation for intentional actions?",
          factoid:
            "Neuroscience research shows that a balanced emotional baseline is associated with better decision-making and mental flexibility.",
        };
      }
  }
};

async function getEmotionCount(user: User, emotion: Emotion): Promise<number> {
  try {
    const userRef = doc(db, "users", user.uid);
    const statsRef = doc(collection(userRef, "stats"), "emotion_counts");

    const docSnapshot = await getDoc(statsRef);

    if (!docSnapshot.exists()) {
      return 0;
    }

    const data = docSnapshot.data();
    return data[emotion] || 0;
  } catch (error) {
    console.error("Error getting emotion count:", error);
    return 0;
  }
}

async function incrementEmotionCount(
  user: User,
  emotion: Emotion
): Promise<void> {
  try {
    const userRef = doc(db, "users", user.uid);
    const statsRef = doc(collection(userRef, "stats"), "emotion_counts");

    const docSnapshot = await getDoc(statsRef);

    if (!docSnapshot.exists()) {
      await setDoc(statsRef, { [emotion]: 1 });
    } else {
      const data = docSnapshot.data();
      const currentCount = data[emotion] || 0;

      await updateDoc(statsRef, {
        [emotion]: currentCount + 1,
      });
    }
  } catch (error) {
    console.error("Error updating emotion count:", error);
  }
}
