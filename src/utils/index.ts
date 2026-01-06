


export function createPageUrl(pageName: string) {
    // Convert camelCase/PascalCase to kebab-case (e.g., RecommendedProfiles -> recommended-profiles)
    return '/' + pageName
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .toLowerCase()
        .replace(/ /g, '-');
}