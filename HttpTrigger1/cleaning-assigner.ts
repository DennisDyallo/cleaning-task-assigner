type Person = "Dennis" | "Emelie" | "Nasti";
type Task = "Kitchen" | "Hallway" | "Living Room" | "Bathroom";

interface TaskAssignments {
    [Person: string]: Task[];
}



function getRandomInt(max: number): number {
    return Math.floor(Math.random() * max);
}

export function assignTasks(): TaskAssignments {
    const theAssignments: TaskAssignments = {
        "Dennis": [] ,
        "Emelie": [],
        "Nasti": []
    };

    const tasksAndPersons: Record<Task, Person[]> = {
        "Kitchen":     ["Dennis", "Emelie", "Nasti"],
        "Hallway":     ["Dennis", "Emelie", "Nasti"],
        "Living Room": ["Dennis", "Emelie", "Nasti"],
        "Bathroom":    ["Dennis", "Emelie"]  // Only A and B clean the bathroom
    };

    const assignedTasksSet = new Set<Task>();

    (Object.keys(tasksAndPersons) as Task[]).forEach(certainTask => {
        const eligiblePersonsFor = tasksAndPersons[certainTask];
        let forThisPerson = eligiblePersonsFor[getRandomInt(eligiblePersonsFor.length)];
    
        // Ensure the person hasn't been assigned the current task and has less than two tasks
        while (theAssignments[forThisPerson].includes(certainTask as Task) || theAssignments[forThisPerson].length >= 2) {
            forThisPerson = eligiblePersonsFor[getRandomInt(eligiblePersonsFor.length)];
        }
    
        theAssignments[forThisPerson].push(certainTask);
        assignedTasksSet.add(certainTask as Task);
    });


    // Ensure that two people are assigned tasks and one person rests
    let personsWithTasks = Object.keys(theAssignments).filter(person => theAssignments[person].length > 0);
    if (personsWithTasks.length !== 2) {
        return assignTasks();  // Recursively reassign if not two people
    }

    return theAssignments;
}

export function formatAssignmentsToHTML(assignments: TaskAssignments): string {
    let breakString: string = "";
    let taskStrings: string[] = [];

    const happyEmojis = ['😁','😍','🥰','🤗']
    const sadEmojis = ['😓','😮','😪','😥']

    for (let person in assignments) {
        let emojiHappy= happyEmojis[getRandomInt(happyEmojis.length)]
        let emojiSad = sadEmojis[getRandomInt(sadEmojis.length)]

        if (assignments[person].length > 0) {
            taskStrings.push(`<li>${person} is assigned to clean: ${assignments[person].join(', ')} ${emojiSad}</li>`);
        } else {
            breakString = `<li><strong>${person} gets a break this week! ${emojiHappy}</strong></li>`;
        }
    }
    
    return `
        <html>
            <head>
                <title>Cleaning Schedule</title>
                <style>
                    ${Styles}
                </style>
            </head>
            <body>
                <ul>
                    <h2>Weekly Cleaning Assignments</h2>
                    ${breakString}
                    ${taskStrings.join('')}
                </ul>
            </body>
        </html>
    `;
}

const Styles = `@keyframes slideFadeIn {
    from {
        opacity: 0;
        transform: translateX(-50px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes pulsate {
    0% {
        font-size: 100%;
    }
    50% {
        font-size: 110%;  // Increase font size by 10%
    }
    100% {
        font-size: 100%;
    }
}

body {
    font-family: Arial, sans-serif;
    height: 100vh;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f4f4f4;
}

ul {
    list-style-type: none;
    padding-left: 0;
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    width: 400px;
    height: 165px;
    line-height: 20px;
}

li {
    animation: slideFadeIn 1s ease-out forwards;
    margin-bottom: 10px;
    opacity: 0;  // Start as transparent
}

li:nth-child(2) {
    line-height: 25px;
    animation: slideFadeIn 1.5s ease-out forwards, pulsate 2s infinite ease-in-out;
    animation-delay: 1.5s, 0s;  // Separate delay for each animation
}

li:nth-child(3) {
    animation-delay: 1s;  // Shortest delay
}

li:nth-child(4) {
    animation-delay: 0.5s;    // Middle delay
}`