const getPollInterval = () => {
    try {
        return 1000 * parseInt(localStorage.getItem('syncDataInterval') || '60');
    } catch (e) {
        return 1000 * 60;
    }
}

const TYPES = new Map<string, { icon: string, color: string, hoverColor: string }>([
    ['Unknown', {icon: 'question_mark', color: '#B388FF', hoverColor: '#805acb'}],
    ['PC', {icon: 'desktop_windows', color: '#FFC107', hoverColor: '#c79100'}],
    ['Phone', {icon: 'phone_android', color: '#03A9F4', hoverColor: '#007ac1'}],
    ['TV Adapter', {icon: 'settings_input_component', color: '#4CAF50', hoverColor: '#087f23'}],
    ['TV', {icon: 'live_tv', color: '#f44336', hoverColor: '#ba000d'}],
    ['Music', {icon: 'speaker', color: '#18FFFF', hoverColor: '#00cbcc'}],
    ['Game console', {icon: 'sports_esports', color: '#E91E63', hoverColor: '#b0003a'}],
    ['Router', {icon: 'router', color: '#009688', hoverColor: '#00675b'}],
    ['Tablet', {icon: 'tablet', color: '#ff9e80', hoverColor: '#c96f53'}],
    ['Printer', {icon: 'print', color: '#5c6bc0', hoverColor: '#26418f'}],
    ['Security', {icon: 'lock', color: '#6a069c', hoverColor: '#37006d'}],
]);

export {getPollInterval, TYPES};