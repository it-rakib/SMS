var DashController = function () {

    var init = function (count) {

        if (count > 0) {
            $("#branchProfiles").modal("show");
            $('.draggable').draggable({
                handle: ".modal-header"
            });
        }

        //{
        //    title: 'Birthday',
        //        description: 'Brithday',
        //            start: moment('2023-07-01'),
        //                end: moment('2023-07-01'),
        //                    color: 'blue',
        //                        allDay: true
        //}

        //CKEDITOR.replace("ckEdit");
        //CKEDITOR.instances['ckEdit'].setData("<h1> data to render</h1>");

        //console.log(CKEDITOR.instances['ckEdit'].getData())


        //        $('#tinyMCE').tinymce({
        //            plugins: [
        //                'powerpaste code emoticons',
        //            ],
        //            height: 500,
        //            /* other settings... */
        //});

        getEvents();


        //drawOragnogram();



        $("#tBranchProfiles").on("dblclick", "td",
            function () {

                var branchId = $(this).closest("tr").find("td:eq(0)").text();
                var BranchName = $(this).closest("tr").find("td:eq(2)").text();

                var form = $('<form>', { method: 'POST' });
                var targetURL = '/Home/AssignBranch';
                form.attr('action', targetURL);

                form.append($('<input>', {
                    type: 'branchId',
                    name: 'branchId',
                    value: branchId
                }));
                form.append($('<input>', {
                    type: 'BranchName',
                    name: 'BranchName',
                    value: BranchName
                }));

                form.hide();

                $(".container-fluid").append(form);

                form.submit();
                form.remove();

            });



        

        const percentageCells = document.querySelectorAll("tbody tr td:nth-child(6)");   
        percentageCells.forEach(cell => {
            const percentage = parseInt(cell.textContent);
            const circle = document.createElement("div");
            circle.className = "percentage-circle";

            const percentageText = document.createElement("span");
            percentageText.className = "percentage-text";
            percentageText.textContent = `${percentage}%`;

            circle.style.background = `conic-gradient(green ${percentage}%, transparent ${percentage}% 100%)`;

            cell.textContent = ""; 
            circle.appendChild(percentageText);
            cell.appendChild(circle);
        });



        //var chartWidth = 400; // Set your desired width
        //var chartHeight = 400; 

        //var d = 40;

        //var pieData = {
        //    labels: ["Category A = " + d + " ", "Category B = 50", "Category C = 10", "Category D = 10"],
        //    datasets: [{
        //        data: [40, 50, 10,10], 
        //        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#36A2EB"]
        //    }]
        //};

        //var uniqueVisitorsCanvas = document.getElementById("uniqueVisitorsChart");
        //var uniqueVisitorsCanvas2 = document.getElementById("uniqueVisitorsChart2");
        //var uniqueVisitorsCanvas3 = document.getElementById("uniqueVisitorsChart3");
        //var uniqueVisitorsCanvas4 = document.getElementById("uniqueVisitorsChart4");


        //uniqueVisitorsCanvas.width = chartWidth;
        //uniqueVisitorsCanvas.height = chartHeight;

        //uniqueVisitorsCanvas2.width = chartWidth;
        //uniqueVisitorsCanvas2.height = chartHeight;

        //uniqueVisitorsCanvas3.width = chartWidth;
        //uniqueVisitorsCanvas3.height = chartHeight;

        //uniqueVisitorsCanvas4.width = chartWidth;
        //uniqueVisitorsCanvas4.height = chartHeight;

        //var uniqueVisitorsChart = new Chart(uniqueVisitorsCanvas, {
        //    type: 'pie',
        //    data: pieData,
        //    options: {
        //        responsive: false,
        //        legend: {
        //            position: 'bottom'
        //        },

        //        plugins: {
        //            legend: {
        //                labels: {
        //                    color: 'red' 
        //                }
        //            }
        //        }

        //    }
        //});
        //var uniqueVisitorsChart2 = new Chart(uniqueVisitorsCanvas2, {
        //    type: 'pie',
        //    data: pieData,
        //    options: {
        //        responsive: false,
        //        legend: {
        //            position: 'bottom'
        //        }
        //    }
        //});
        //var uniqueVisitorsChart3 = new Chart(uniqueVisitorsCanvas3, {
        //    type: 'pie',
        //    data: pieData,
        //    options: {
        //        responsive: false,
        //        legend: {
        //            position: 'bottom'
        //        }
        //    }
        //});
        //var uniqueVisitorsChart4 = new Chart(uniqueVisitorsCanvas4, {
        //    type: 'pie',
        //    data: pieData,
        //    options: {
        //        responsive: false,
        //        legend: {
        //            position: 'bottom'
        //        }
        //    }
        //});





    }

    function drawOragnogram() {
        google.load("visualization", "1", { packages: ["orgchart"] });
        google.setOnLoadCallback(drawChart);
    }




    function drawChart() {
        $.ajax({
            type: "GET",
            url: "/Home/GetEmployees",
        })
            .done(function (result) {


                var data = new google.visualization.DataTable();
                data.addColumn('string', 'Entity');
                data.addColumn('string', 'ParentEntity');
                data.addColumn('string', 'ToolTip');
                for (var i = 0; i < result.length; i++) {
                    var employeeId = result[i][0].toString();
                    var employeeName = result[i][1];
                    var designation = result[i][2];
                    var reportingManager = result[i][3] != 0 ? result[i][3].toString() : '';

                    var row =
                        [
                            [

                                {
                                    v: employeeId,
                                    f: employeeName + '<div>(<span>' + designation + '</span>)</div><img src = "/Images/' + employeeId + '.jpg" />'
                                }, reportingManager, designation
                            ]

                        ]




                    data.addRows(row);
                }

                var chart = new google.visualization.OrgChart($("#chart")[0]);
                chart.draw(data, { allowHtml: true });
            })
            .fail(function () {
                alert('failed');
            });

    }

    function getEvents() {

        var events = [];
        $.ajax({
            type: "GET",
            url: "/calender/GetEvents",

        })
            .done(function (data) {

                GenerateCalender(data);


            })
            .fail(function (fail) {
                alert('failed');
            });

    }


    function GenerateCalender(events) {
        $('#calender').fullCalendar('destroy');
        $('#calender').fullCalendar({
            contentHeight: 400,
            defaultDate: new Date(),
            timeFormat: 'h(:mm)a',
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,basicWeek,basicDay,agenda'
            },
            eventLimit: true,
            eventColor: '#378006',
            events: events,
            eventClick: function (calEvent, jsEvent, view) {
                //$('#myModal #eventTitle').text(calEvent.title);
                //var $description = $('<div/>');
                //$description.append($('<p/>').html('<b>Start:</b>' + calEvent.start.format("DD-MMM-YYYY HH:mm a")));
                //if (calEvent.end != null) {
                //    $description.append($('<p/>').html('<b>End:</b>' + calEvent.end.format("DD-MMM-YYYY HH:mm a")));
                //}
                //$description.append($('<p/>').html('<b>Description:</b>' + calEvent.description));
                //$('#myModal #pDetails').empty().html($description);

                //$('#myModal').modal();


            }
        })
    }

    return {
        init: init
    }

}();