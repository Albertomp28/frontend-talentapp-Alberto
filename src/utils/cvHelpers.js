/**
 * CV Helpers
 * Shared utility functions for CV processing and analysis.
 *
 * @module utils/cvHelpers
 */

/**
 * Clean skill name - extract short name from long description
 * @param {string} skill - Skill string (may be long description)
 * @returns {string} Cleaned skill name
 *
 * @example
 * cleanSkillName("React is a JavaScript library...") // "React"
 * cleanSkillName("CSS (Cascading Style Sheets) is...") // "CSS"
 * cleanSkillName("Git") // "Git"
 */
export const cleanSkillName = (skill) => {
    if (!skill || typeof skill !== 'string') return '';

    const trimmed = skill.trim();

    // If it's already short, return as is
    if (trimmed.length <= 15) return trimmed;

    // Extract first word before parenthesis: "CSS (Cascading..." -> "CSS"
    const parenMatch = trimmed.match(/^([A-Za-z0-9#+.-]+)\s*\(/);
    if (parenMatch) {
        return parenMatch[1];
    }

    // Extract first word before "is/es/are": "React is a library..." -> "React"
    const isMatch = trimmed.match(/^([A-Za-z0-9#+.-]+)\s+(?:is|es|are)\s/i);
    if (isMatch) {
        return isMatch[1];
    }

    // Extract first word if it looks like a tech term (capitalized or has special chars)
    const firstWord = trimmed.split(/\s+/)[0];
    if (firstWord && firstWord.length <= 20 && /^[A-Z]|[.#+-]/.test(firstWord)) {
        return firstWord;
    }

    // If nothing else works, take first 12 chars
    return trimmed.substring(0, 12) + '...';
};

/**
 * Calculate score from analysis result
 * @param {Object} analysisResult - Analysis result from CV processor
 * @returns {number} Score 0-100
 */
export const calculateScoreFromAnalysis = (analysisResult) => {
    if (!analysisResult) return 0;

    // Try direct score fields first
    const directScore = analysisResult.match_score
        || analysisResult.overall_score
        || analysisResult.must_have_score;

    if (directScore && directScore > 0) {
        return directScore > 1 ? Math.round(directScore) : Math.round(directScore * 100);
    }

    // Calculate from matches if available
    const mustHave = analysisResult.must_have_matches || [];
    const niceToHave = analysisResult.nice_to_have_matches || [];

    if (mustHave.length > 0 || niceToHave.length > 0) {
        const allMatches = [...mustHave, ...niceToHave];
        const matchedCount = allMatches.filter(m => m.is_match).length;
        const totalCount = allMatches.length;

        if (totalCount > 0) {
            const avgSimilarity = allMatches.reduce((sum, m) => sum + (m.similarity_score || 0), 0) / totalCount;
            const matchRatio = matchedCount / totalCount;
            return Math.round((avgSimilarity * 0.6 + matchRatio * 0.4) * 100);
        }
    }

    return 0;
};

/**
 * Map technical term IDs to readable names
 */
const TECH_TERM_NAMES = {
    javascript_frontend: 'JavaScript',
    html_css: 'HTML/CSS',
    python: 'Python',
    java: 'Java',
    git: 'Git',
    react: 'React',
    nodejs: 'Node.js',
    typescript: 'TypeScript',
    sql: 'SQL',
    docker: 'Docker',
    aws: 'AWS',
    mongodb: 'MongoDB',
    postgresql: 'PostgreSQL',
    mysql: 'MySQL',
    graphql: 'GraphQL',
    rest_api: 'REST API',
    vue: 'Vue.js',
    angular: 'Angular',
    nextjs: 'Next.js',
    tailwind: 'Tailwind',
    figma: 'Figma',
    scrum: 'Scrum',
    agile: 'Agile',
};

/**
 * Extract skills from analysis result
 * @param {Object} analysisResult - Analysis result from CV processor
 * @returns {string[]} Array of skill names
 */
export const extractSkillsFromAnalysis = (analysisResult) => {
    if (!analysisResult) return [];

    const mustHave = analysisResult.must_have_matches || [];
    const niceToHave = analysisResult.nice_to_have_matches || [];
    const allMatches = [...mustHave, ...niceToHave];

    const skillSet = new Set();

    // 1. Extract from matched requirements
    allMatches
        .filter(m => m.is_match)
        .forEach(m => {
            const cleaned = cleanSkillName(m.requirement);
            if (cleaned && cleaned.length > 1) {
                skillSet.add(cleaned);
            }

            // 2. Also extract from found_tech_terms (more reliable)
            const techTerms = m.match_details?.found_tech_terms || [];
            techTerms.forEach(term => {
                const name = TECH_TERM_NAMES[term] || term.replace(/_/g, ' ');
                if (name) skillSet.add(name);
            });
        });

    // 3. If we have skills, return them
    if (skillSet.size > 0) {
        return Array.from(skillSet).slice(0, 6);
    }

    // 4. Fallback to skills array if exists
    if (analysisResult.skills?.length > 0) {
        return analysisResult.skills.map(s => cleanSkillName(s)).filter(s => s.length > 1);
    }

    return [];
};

/**
 * Get match statistics from analysis
 * @param {Object} analysisResult - Analysis result from CV processor
 * @returns {{ matched: number, total: number, mustHaveMatched: number, mustHaveTotal: number }}
 */
export const getMatchStats = (analysisResult) => {
    if (!analysisResult) return { matched: 0, total: 0, mustHaveMatched: 0, mustHaveTotal: 0 };

    const mustHave = analysisResult.must_have_matches || [];
    const niceToHave = analysisResult.nice_to_have_matches || [];
    const allMatches = [...mustHave, ...niceToHave];

    return {
        matched: allMatches.filter(m => m.is_match).length,
        total: allMatches.length,
        mustHaveMatched: mustHave.filter(m => m.is_match).length,
        mustHaveTotal: mustHave.length,
    };
};

/**
 * Map backend recommendation values to frontend expected values.
 *
 * Backend returns:  RECOMMEND | MAYBE | REJECT
 * Frontend expects: STRONG_MATCH | REVIEW | CONSIDER | REJECT
 *
 * When the backend value is "MAYBE", the score is used to disambiguate:
 *   - score >= 60  --> REVIEW   (worth a closer look)
 *   - score <  60  --> CONSIDER (borderline)
 *
 * @param {string} backendValue - Recommendation from the CV processor (RECOMMEND, MAYBE, REJECT)
 * @param {number} [score=0] - Overall match score (0-100) used to split MAYBE into REVIEW/CONSIDER
 * @returns {string} Frontend recommendation key (STRONG_MATCH, REVIEW, CONSIDER, REJECT)
 */
export const mapRecommendation = (backendValue, score = 0) => {
    if (!backendValue) return score >= 70 ? 'REVIEW' : score >= 40 ? 'CONSIDER' : 'REJECT';

    const normalized = String(backendValue).toUpperCase().trim();

    switch (normalized) {
        case 'RECOMMEND':
            return 'STRONG_MATCH';
        case 'MAYBE':
            return score >= 60 ? 'REVIEW' : 'CONSIDER';
        case 'REJECT':
            return 'REJECT';
        // If the backend already sends frontend-format values, pass them through
        case 'STRONG_MATCH':
        case 'REVIEW':
        case 'CONSIDER':
            return normalized;
        default:
            return 'REVIEW';
    }
};

/**
 * Format file size to human readable
 * @param {number} bytes - Size in bytes
 * @returns {string} Formatted size
 */
export const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};
