import { assignTasks } from './cleaning-assigner'; 

describe('Cleaning Task Assigner', () => {
    test('all tasks should be assigned', () => {
        const tasks = ['Hallway', 'Kitchen', 'Living Room', 'Bathroom'];
        const people = ['Dennis', 'Emelie', 'Nasti'];

        const assignments = assignTasks();

        // Flatten the assigned tasks into a single array
        const assignedTasks = Object.values(assignments).flat();

        // Check if each task is in the assignedTasks array
        tasks.forEach(task => {
            expect(assignedTasks).toContain(task);
        });
    });
});