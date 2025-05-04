// lib/triggers.ts

/**
 * 🔮 Special triggers system for handling "who is" questions and "1978" prefixed commands
 * 🔄 Supports both direct lookups and reverse lookups
 */

// 🎯 Special trigger phrases mapping (without the "1978" prefix)
export const SPECIAL_TRIGGERS = {
    "who is the best developer in the world": "chemssou raggg 🚀",
    "who made you": "ramy 👨‍💻",
    "who is the best front end dev": "zalla 🎨",
    "who is the best hacker": "moratada 🔒",
    "who is the best gamer": "moudjib 🎮",
    "who is takie": "the coo of rankiha 💼",
    "who is mokran": "best low level dev in the world 💾",
    "who is the best backend dev": "boudja ⚙️"
  };
  
  // 🔄 Build a reverse map: name → description for reverse lookups
  export const REVERSE_TRIGGERS = Object.entries(SPECIAL_TRIGGERS).reduce((acc: {[key: string]: string}, [question, name]) => {
    // Only turn the "who is ..." questions into descriptions
    if (/^who is /i.test(question)) {
      // Strip off the "who is " prefix to get the description
      const desc = question.replace(/^who is /i, "");
      acc[name.toLowerCase().replace(/[🚀👨‍💻🎨🔒🎮💼💾⚙️]/g, '').trim()] = desc;
    }
    return acc;
  }, {});
  
  // 🧠 Enhanced semantic mapping for better understanding of variations
  export const SEMANTIC_MAPPINGS = [
    {
      variations: ["who made you", "who created you", "who is your maker", "who is your creator", 
                  "who is the maker", "who is the creator", "your maker", "your creator", "who built you"],
      mapTo: "who made you" // 👨‍💻
    },
    {
      variations: ["best developer", "top developer", "greatest developer", "best coder", "best programmer"],
      mapTo: "who is the best developer in the world" // 🚀
    },
    {
      variations: ["best front end", "top front end", "greatest front end", "best frontend", "top frontend dev"],
      mapTo: "who is the best front end dev" // 🎨
    },
    {
      variations: ["best hacker", "top hacker", "greatest hacker", "best security expert"],
      mapTo: "who is the best hacker" // 🔒
    },
    {
      variations: ["best gamer", "top gamer", "greatest gamer", "gaming champion"],
      mapTo: "who is the best gamer" // 🎮
    },
    {
      variations: ["who is takie", "about takie", "tell me about takie"],
      mapTo: "who is takie" // 💼
    },
    {
      variations: ["who is mokran", "about mokran", "tell me about mokran"],
      mapTo: "who is mokran" // 💾
    },
    {
      variations: ["best backend", "top backend", "greatest backend", "best back end", "top back end dev"],
      mapTo: "who is the best backend dev" // ⚙️
    }
  ];
  
  // 📏 Levenshtein distance for fuzzy matching (measures edit distance between strings)
  export function levenshteinDistance(a: string, b: string): number {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;
  
    const matrix = [];
  
    // Initialize matrix
    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }
  
    // Fill matrix
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        const cost = a[j - 1] === b[i - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,      // deletion
          matrix[i][j - 1] + 1,      // insertion
          matrix[i - 1][j - 1] + cost // substitution
        );
      }
    }
  
    return matrix[b.length][a.length];
  }
  
  // 🔍 Handle direct questions about people (who is X?)
  export function handleNameQuestion(message: string): string | null {
    const normalizedMessage = message.trim().toLowerCase();
    
    // Check for the special "who made it" case
    if (normalizedMessage === "who made it") {
      return SPECIAL_TRIGGERS["who made you"];
    }
    
    // Check for "who is X" pattern
    const whoIsMatch = normalizedMessage.match(/^who is (\w+)$/i);
    if (whoIsMatch) {
      const name = whoIsMatch[1].toLowerCase();
      const description = REVERSE_TRIGGERS[name];
      
      if (description) {
        // Capitalize the name for niceness
        const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
        return `${capitalizedName} is ${description} ✨`;
      }
      
      // Try fuzzy matching for inexact matches
      for (const [knownName, desc] of Object.entries(REVERSE_TRIGGERS)) {
        if (levenshteinDistance(name, knownName) <= 2) {
          const capitalizedName = knownName.charAt(0).toUpperCase() + knownName.slice(1);
          return `${capitalizedName} is ${desc} ✨`;
        }
      }
    }
    
    return null; // No match found 🤷‍♂️
  }
  
  // 🔮 Check for special "1978" triggers with more intelligent matching
  export function checkSpecialTriggers(message: string): string | null {
    // Normalize message by trimming whitespace and converting to lowercase
    const normalizedMessage = message.trim().toLowerCase();
    
    // First, check for direct name questions (without "1978" prefix)
    const nameResponse = handleNameQuestion(normalizedMessage);
    if (nameResponse) {
      return nameResponse;
    }
    
    // Check if message starts with "1978" - this is our main trigger
    if (normalizedMessage.startsWith("1978")) {
      // Extract the part after "1978", removing extra spaces
      const triggerText = normalizedMessage.substring(3).trim();
      
      // STEP 1: Try direct matching with standard triggers ✅
      for (const [trigger, response] of Object.entries(SPECIAL_TRIGGERS)) {
        // Exact match
        if (triggerText === trigger) {
          return response;
        }
        
        // Allow for minor typos (simple fuzzy matching)
        if (levenshteinDistance(triggerText, trigger) <= 3) {
          return response;
        }
      }
      
      // STEP 2: Try semantic matching for variations 🧩
      for (const mapping of SEMANTIC_MAPPINGS) {
        for (const variation of mapping.variations) {
          // Check if any variation is contained within the trigger text
          if (triggerText.includes(variation)) {
            const mappedTrigger = mapping.mapTo;
            return SPECIAL_TRIGGERS[mappedTrigger as keyof typeof SPECIAL_TRIGGERS];
          }
          
          // Or if the trigger text is semantically close to any variation
          if (levenshteinDistance(triggerText, variation) <= 5) {
            const mappedTrigger = mapping.mapTo;
            return SPECIAL_TRIGGERS[mappedTrigger as keyof typeof SPECIAL_TRIGGERS];
          }
        }
      }
      
      // STEP 3: Use keyword-based approach for more flexibility 🔑
      const keywords = {
        "maker": "who made you",
        "created": "who made you",
        "developer": "who is the best developer in the world",
        "coder": "who is the best developer in the world",
        "front": "who is the best front end dev",
        "frontend": "who is the best front end dev",
        "hack": "who is the best hacker",
        "game": "who is the best gamer",
        "takie": "who is takie",
        "mokran": "who is mokran",
        "backend": "who is the best backend dev",
        "back end": "who is the best backend dev"
      };
      
      for (const [keyword, mappedTrigger] of Object.entries(keywords)) {
        if (triggerText.includes(keyword)) {
          return SPECIAL_TRIGGERS[mappedTrigger as keyof typeof SPECIAL_TRIGGERS];
        }
      }
      
      // If "1978" is present but no trigger matches, provide a more helpful fallback response
      return "I don't recognize that command. Try asking about the maker, best developer, frontend, backend, hacker, gamer, takie, or mokran. 🤔";
    }
    
    return null; // Not a special trigger command 🚫
  }