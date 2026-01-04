import { reactive } from 'vue';

// Reactive array to store plans (simulating database)
export const mockWeeklyPlans = reactive([
    {
        id: 'plan-001',
        weekStart: '2026-01-04',
        weekEnd: '2026-01-10',
        label: '04/01/2026 - 10/01/2026',
        days: [
            { dayName: 'יום א', shiftName: 'בוקר', entry: '07:00', exit: '16:15', isActive: true },
            { dayName: 'יום ב', shiftName: 'בוקר', entry: '07:00', exit: '16:15', isActive: true },
            { dayName: 'יום ג', shiftName: 'בוקר', entry: '07:00', exit: '16:15', isActive: true },
            { dayName: 'יום ד', shiftName: 'בוקר', entry: '07:00', exit: '16:15', isActive: true },
            { dayName: 'יום ה', shiftName: 'בוקר', entry: '07:00', exit: '16:15', isActive: true },
            { dayName: 'יום ו', shiftName: 'בוקר', entry: '07:00', exit: '11:15', isActive: true },
            { dayName: 'שבת', shiftName: 'בוקר', entry: '--:--', exit: '--:--', isActive: false },
        ]
    },
    {
        id: 'plan-002',
        weekStart: '2025-12-28',
        weekEnd: '2026-01-03',
        label: '28/12/2025 - 03/01/2026',
        days: [
            { dayName: 'יום א', shiftName: 'בוקר', entry: '08:00', exit: '17:00', isActive: true },
            { dayName: 'יום ב', shiftName: 'ערב', entry: '15:00', exit: '23:00', isActive: true },
            { dayName: 'יום ג', shiftName: 'בוקר', entry: '08:00', exit: '17:00', isActive: true },
            { dayName: 'יום ד', shiftName: 'בוקר', entry: '08:00', exit: '17:00', isActive: true },
            { dayName: 'יום ה', shiftName: 'ערב', entry: '15:00', exit: '23:00', isActive: true },
            { dayName: 'יום ו', shiftName: 'בוקר', entry: '08:00', exit: '12:00', isActive: true },
            { dayName: 'שבת', shiftName: 'בוקר', entry: '--:--', exit: '--:--', isActive: false },
        ]
    }
]);
