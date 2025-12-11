// Script để clear cache hoàn toàn
console.log("🧹 Clearing all caches...");

// Clear localStorage
try {
    localStorage.removeItem('persist:root');
    console.log("✅ Cleared persist:root");
} catch (e) {
    console.warn("⚠️ Error clearing persist:root:", e);
}

// Clear all localStorage
try {
    localStorage.clear();
    console.log("✅ Cleared all localStorage");
} catch (e) {
    console.warn("⚠️ Error clearing localStorage:", e);
}

// Clear sessionStorage
try {
    sessionStorage.clear();
    console.log("✅ Cleared sessionStorage");
} catch (e) {
    console.warn("⚠️ Error clearing sessionStorage:", e);
}

console.log("✅ All caches cleared! Reloading page...");
setTimeout(() => {
    window.location.reload();
}, 500);

