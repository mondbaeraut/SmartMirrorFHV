$(document).ready(function () {

    if (!!window.EventSource) {
        let source = new EventSource('/sse/miband');

        source.addEventListener('message', function (e) {
            console.log("EventSource message");
            let mibandData = JSON.parse(e.data);

            let steps = $("#steps");
            steps.empty();
            steps.append(`
                <p class="fade">Zähler ${mibandData.number} <br /> +${mibandData.stepsNew} Punkte!</p>
                <table class="fade">
                    <tr>
                        <td>Eigene Punkte</td>
                        <td>${mibandData.steps}</td>
                    </tr>
                    <tr>
                        <td>Gruppe</td>
                        <td>${mibandData.dailyStepsTotal}</td>
                    </tr>
                    <tr>
                        <td>Akkustand</td>
                        <td>${mibandData.batteryLevel}%</td>
                    </tr>
                </table>
            `);
			
			// Make the leaves rise when new steps incoming
			removeLeaves(mibandData.stepsNew/10);

        }, false);

        source.addEventListener('open', function (e) {
            console.log("SSE Connected");
        }, false);

        source.addEventListener('error', function (e) {
            if (e.target.readyState === EventSource.CLOSED) {
                console.log("EventSource disconnected", e);
            }
            else if (e.target.readyState === EventSource.CONNECTING) {
                console.log("EventSource connecting...");
            }
        }, false)
    } else {
        console.log("Your browser doesn't support SSE");
    }
});
