const POLL_INTERVAL = 60 * 1000;

const TYPE_TO_ICON = new Map<string, string>([
    ['Unknown', 'question_mark'],
    ['PC', 'desktop_windows'],
    ['Phone', 'phone_android'],
    ['TV Adapter', 'settings_input_component'],
    ['TV', 'live_tv'],
    ['Music', 'speaker'],
    ['Game console', 'sports_esports'],
    ['Router', 'router'],
    ['Tablet', 'tablet'],
    ['Printer', 'print'],
    ['Security', 'lock'],
]);

export {POLL_INTERVAL, TYPE_TO_ICON};