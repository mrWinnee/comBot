function createTeams(participants) {
    // Sort participants by evaluation in descending order
    participants.sort((a, b) => b.evaluation - a.evaluation);

    // Number of teams, assuming participants length is divisible by 5
    const numTeams = participants.length / 5;

    // Initialize empty teams
    let teams = Array.from({ length: numTeams }, () => []);

    // Use a zigzag approach to balance the evaluations
    let left = 0;
    let right = participants.length - 1;
    let direction = true; // Start with the leftmost participant

    // Distribute participants into teams
    for (let i = 0; i < participants.length; i++) {
        if (direction) {
            teams[i % numTeams].push(participants[left]);
            left++;
        } else {
            teams[i % numTeams].push(participants[right]);
            right--;
        }

        // Change direction after filling each team
        if ((i + 1) % numTeams === 0) {
            direction = !direction;
        }
    }

    // Calculate total evaluation for each team
    let teamEvaluations = teams.map((team) =>
        team.reduce((sum, participant) => sum + participant.evaluation, 0),
    );

    return { teams, teamEvaluations };
}

function sendTeamsReport(teams, channel) {
    teams.forEach((team, index) => {
        const teamMembers = team.map((member) => `<@${member.userId}>`); // Get member IDs as mentions
        const teamMessage = `🚩 Team ${index + 1}: ${teamMembers.join(", ")}`; // Format team message
        channel.send(teamMessage);
    });
}

module.exports = { createTeams, sendTeamsReport };