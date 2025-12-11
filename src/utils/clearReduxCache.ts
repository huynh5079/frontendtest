// Utility để clear Redux cache khi có lỗi
export const clearReduxCache = () => {
    try {
        localStorage.removeItem('persist:root');
        console.log('✅ Đã clear Redux cache');
        return true;
    } catch (e) {
        console.error('❌ Lỗi khi clear cache:', e);
        return false;
    }
};

// Auto-clear nếu detect lỗi
if (typeof window !== 'undefined') {
    // Chạy sau khi page load
    window.addEventListener('load', () => {
        const hasError = sessionStorage.getItem('redux-error-detected');
        if (hasError) {
            clearReduxCache();
            sessionStorage.removeItem('redux-error-detected');
            window.location.reload();
        }
    });
}

