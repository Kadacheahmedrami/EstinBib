// utils/semantic.ts

/**
 * Checks if a query is semantically related to specific keywords
 * @param query The user query to check
 * @param keywords Array of keywords to check against
 * @param threshold Minimum similarity required (0-1)
 * @returns Boolean indicating if there's a meaningful match
 */
export function keywordsMatch(query: string, keywords: string[], threshold: number = 0.7): boolean {
    // Convert everything to lowercase for comparison
    const normalizedQuery = query.toLowerCase()
    const normalizedKeywords = keywords.map(k => k.toLowerCase())
    
    // Direct match check - if any keyword is directly in the query
    for (const keyword of normalizedKeywords) {
      if (normalizedQuery.includes(keyword)) {
        return true
      }
    }
    
    // Word-level match - check if specific words match
    const queryWords = normalizedQuery
      .split(/\s+/)
      .map(word => word.replace(/[^\w]/g, ''))
      .filter(Boolean)
    
    let matchCount = 0
    
    for (const keyword of normalizedKeywords) {
      const keywordWords = keyword
        .split(/\s+/)
        .map(word => word.replace(/[^\w]/g, ''))
        .filter(Boolean)
        
      for (const keywordWord of keywordWords) {
        if (keywordWord.length < 3) continue // Skip very short words
        
        if (queryWords.includes(keywordWord)) {
          matchCount++
        }
      }
    }
    
    // Calculate match ratio
    const maxPossibleMatches = Math.max(1, queryWords.length)
    const matchRatio = matchCount / maxPossibleMatches
    
    return matchRatio >= threshold
  }
  
  /**
   * Checks if a query is likely to be inappropriate or about a topic
   * that wouldn't be in a typical library
   * @param query User query to analyze
   * @returns Boolean indicating if topic is inappropriate for library
   */
  export function isInappropriateQuery(query: string): boolean {
    const inappropriateKeywords = [
      'porn', 'pornography', 'xxx', 'adult film', 'adult video',
      'escort', 'gambling', 'illegal drugs', 'weapons', 'make bombs',
      'terrorism', 'extremist', 'torture', 'suicide methods'
    ]
    
    return keywordsMatch(query, inappropriateKeywords, 0.5)
  }