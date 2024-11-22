function reset() {
  for (var i = 1; i <= 5; i++) {
    for (var j = 1; j <= 3; j++) {
      document.getElementById("a" + i + j).value = "";
      document.getElementById("m" + i + j).value = "";
      document.getElementById("n" + i + j).value = "";
    }
    document.getElementById("p" + i).value = "";
  }
  document.getElementById("av11").value = "";
  document.getElementById("av12").value = "";
  document.getElementById("av13").value = "";
  document.getElementById("resourceA").value = "";
  document.getElementById("resourceB").value = "";
  document.getElementById("resourceC").value = "";
  document.body.style.backgroundColor = "#ffffff";
}

function example() {
  sam = [
    [0, 1, 0],
    [2, 0, 0],
    [3, 0, 2],
    [2, 1, 1],
    [0, 0, 2],
  ];

  max = [
    [7, 5, 3],
    [3, 2, 2],
    [9, 0, 2],
    [2, 2, 2],
    [4, 3, 3],
  ];
  for (var i = 1; i <= 5; i++) {
    for (var j = 1; j <= 3; j++) {
      document.getElementById("a" + i + j).value = sam[i - 1][j - 1];
      document.getElementById("m" + i + j).value = max[i - 1][j - 1];
    }
  }
  document.getElementById("resourceA").value = 10;
  document.getElementById("resourceB").value = 5;
  document.getElementById("resourceC").value = 7;
}

function find_avai() {
  var a = document.getElementById("resourceA").value;
  var b = document.getElementById("resourceB").value;
  var c = document.getElementById("resourceC").value;
  var x = 0;
  var y = 0;
  var z = 0;
  for (var i = 1; i <= 5; i++) {
    var x = x + parseInt(document.getElementById("a" + i + "1").value);
    var y = y + parseInt(document.getElementById("a" + i + "2").value);
    var z = z + parseInt(document.getElementById("a" + i + "3").value);
  }
  document.getElementById("av11").value = a - x;
  document.getElementById("av12").value = b - y;
  document.getElementById("av13").value = c - z;
}

function find_need() {
  for (var i = 1; i <= 5; i++) {
    for (var j = 1; j <= 3; j++) {
      document.getElementById("n" + i + j).value =
        parseInt(document.getElementById("m" + i + j).value) -
        parseInt(document.getElementById("a" + i + j).value);
    }
  }
}

function run_algo() {
  find_avai();
  find_need();

  var finished = [false, false, false, false, false]; // Đánh dấu trạng thái tiến trình
  var safeSequence = []; // Mảng lưu trữ thứ tự tiến trình đã hoàn thành
  var numFinished = 0; // Số tiến trình đã hoàn thành

  while (numFinished < 5) {
    var found = false; // Kiểm tra xem có tiến trình nào được hoàn thành trong vòng lặp này

    for (var i = 1; i <= 5; i++) {
      if (!finished[i - 1]) {
        // Nếu tiến trình chưa hoàn thành
        var x1 = parseInt(document.getElementById("av11").value);
        var x2 = parseInt(document.getElementById("av12").value);
        var x3 = parseInt(document.getElementById("av13").value);

        var need1 = parseInt(document.getElementById("n" + i + "1").value);
        var need2 = parseInt(document.getElementById("n" + i + "2").value);
        var need3 = parseInt(document.getElementById("n" + i + "3").value);

        if (x1 >= need1 && x2 >= need2 && x3 >= need3) {
          // Nếu tiến trình có thể hoàn thành
          found = true; // Có ít nhất một tiến trình được hoàn thành
          finished[i - 1] = true; // Đánh dấu tiến trình này đã hoàn thành
          safeSequence.push("P" + i); // Thêm tiến trình vào thứ tự an toàn
          numFinished++; // Tăng số tiến trình đã hoàn thành

          // Cập nhật tài nguyên khả dụng (Available)
          document.getElementById("av11").value =
            x1 + parseInt(document.getElementById("a" + i + "1").value);
          document.getElementById("av12").value =
            x2 + parseInt(document.getElementById("a" + i + "2").value);
          document.getElementById("av13").value =
            x3 + parseInt(document.getElementById("a" + i + "3").value);

          break; // Thoát vòng lặp để bắt đầu lại kiểm tra từ tiến trình đầu tiên
        }
      }
    }

    if (!found) {
      // Nếu không có tiến trình nào được hoàn thành trong vòng lặp, hệ thống bị Deadlock
      var deadlockProcesses = []; // Danh sách các tiến trình gây ra Deadlock
      for (var i = 1; i <= 5; i++) {
        if (!finished[i - 1]) {
          deadlockProcesses.push("P" + i);
        }
      }

      // Hiển thị trạng thái Deadlock
      alert(
        "Deadlock!!\nTiến trình an toàn tới: " +
          safeSequence.join(" -> ") +
          "\nTiến trình gặp Deadlock tại: " +
          deadlockProcesses.join(", ")
      );

      // Hiển thị Process Sequence trong giao diện
      for (var i = 1; i <= safeSequence.length; i++) {
        document.getElementById("p" + i).value = safeSequence[i - 1];
      }

      document.body.style.backgroundColor = "#ff7171";
      return; // Kết thúc hàm
    }
  }

  // Nếu tất cả tiến trình hoàn thành, hệ thống ở trạng thái an toàn
  document.body.style.backgroundColor = "#28df99";
  alert("Safe!! \nThứ tự an toàn là: " + safeSequence.join(" -> "));

  // Hiển thị Process Sequence trong giao diện
  for (var i = 1; i <= 5; i++) {
    document.getElementById("p" + i).value = safeSequence[i - 1] || "";
  }
}
