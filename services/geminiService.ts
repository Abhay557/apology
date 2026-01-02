
// Mock service to avoid API usage
const CUTE_APOLOGIES = [
    "I'm barely holding it together without you! 🥺 Please forgive me?",
    "Roses are red, violets are blue, I made a mistake, but I still love you! ❤️",
    "I promise to give you unlimited hugs and snacks if you forgive me! 🍪🤗",
    "My heart is feeling super heavy... can your smile fix it? 🤕",
    "I was a little baka 😣, but I'm YOUR little baka! Forgive me?",
    "Error 404: Brain not found when I made that mistake. Rebooting with extra love! 🤖❤️",
    " sending virtual puppy eyes... 🥺 did it work?",
    "I promise to be 110% sweeter from now on! 🍭",
];

export const generateApologyMessage = async (recipient: string, reason: string): Promise<string> => {
    // Simulate a short delay to make it feel like "thinking"
    await new Promise(resolve => setTimeout(resolve, 1500));

    const randomMessage = CUTE_APOLOGIES[Math.floor(Math.random() * CUTE_APOLOGIES.length)];

    // Personalize it slightly
    return `${recipient}, ${randomMessage} (I'm so sorry about ${reason}!)`;
};