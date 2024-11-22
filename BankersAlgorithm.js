function reset() {
  // Reset tất cả các ô input về rỗng
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
  document.body.style.backgroundColor = "#ffffff";
}

function example() {
  // Khởi tạo mảng mẫu cho Allocation
  const sam = [
    [0, 1, 0],
    [2, 0, 0],
    [3, 0, 2],
    [2, 1, 1],
    [0, 0, 2],
  ];

  // Khởi tạo mảng mẫu cho Max
  const max = [
    [7, 5, 3],
    [3, 2, 2],
    [9, 0, 2],
    [2, 2, 2],
    [4, 3, 3],
  ];

  // Điền các giá trị mẫu vào bảng
  for (var i = 1; i <= 5; i++) {
    for (var j = 1; j <= 3; j++) {
      document.getElementById("a" + i + j).value = sam[i - 1][j - 1];
      document.getElementById("m" + i + j).value = max[i - 1][j - 1];
    }
  }

  // Điền giá trị mẫu cho Available   document.getElementById("av11").value = 3;
  document.getElementById("av12").value = 3;
  document.getElementById("av13").value = 2;
}

function find_avai() {
  // Lấy giá trị Available hiện tại
  var av11 = parseInt(document.getElementById("av11").value) || 0;
  var av12 = parseInt(document.getElementById("av12").value) || 0;
  var av13 = parseInt(document.getElementById("av13").value) || 0;

  // Nếu Available chưa có giá trị, tính toán từ Allocation và resource tổng
  if (av11 === 0 && av12 === 0 && av13 === 0) {
    var a = parseInt(document.getElementById("resourceA").value) || 0;
    var b = parseInt(document.getElementById("resourceB").value) || 0;
    var c = parseInt(document.getElementById("resourceC").value) || 0;

    var x = 0;
    var y = 0;
    var z = 0;

    for (var i = 1; i <= 5; i++) {
      x += parseInt(document.getElementById("a" + i + "1").value) || 0;
      y += parseInt(document.getElementById("a" + i + "2").value) || 0;
      z += parseInt(document.getElementById("a" + i + "3").value) || 0;
    }

    document.getElementById("av11").value = a - x;
    document.getElementById("av12").value = b - y;
    document.getElementById("av13").value = c - z;
  }
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

  const n = 5; // Số tiến trình
  const r = 3; // Số tài nguyên

  // Khởi tạo các mảng
  const alloc = []; // Ma trận Allocation
  const need = []; // Ma trận Need
  const avail = [
    // Mảng Available
    parseInt(document.getElementById("av11").value) || 0,
    parseInt(document.getElementById("av12").value) || 0,
    parseInt(document.getElementById("av13").value) || 0,
  ];

  // Lấy dữ liệu Allocation và Need từ giao diện
  for (var i = 1; i <= n; i++) {
    alloc.push([
      parseInt(document.getElementById("a" + i + "1").value) || 0,
      parseInt(document.getElementById("a" + i + "2").value) || 0,
      parseInt(document.getElementById("a" + i + "3").value) || 0,
    ]);

    need.push([
      parseInt(document.getElementById("n" + i + "1").value) || 0,
      parseInt(document.getElementById("n" + i + "2").value) || 0,
      parseInt(document.getElementById("n" + i + "3").value) || 0,
    ]);
  }

  const f = Array(n).fill(false); // Mảng đánh dấu process đã hoàn thành
  const safeSequence = []; // Mảng lưu thứ tự an toàn
  let numFinished = 0;

  // Vòng lặp chính của thuật toán
  while (numFinished < n) {
    let found = false; // Đánh dấu có tìm được process thực thi không

    // Duyệt qua từng process
    for (var i = 0; i < n; i++) {
      if (!f[i]) {
        // Nếu process chưa hoàn thành

        let flag = true;

        // Kiểm tra xem process có thể thực thi không
        for (var j = 0; j < r; j++) {
          if (need[i][j] > avail[j]) {
            flag = false;
            break;
          }
        }

        if (flag) {
          // Tiến trình có thể hoàn thành
          for (var j = 0; j < r; j++) {
            avail[j] += alloc[i][j];
          }

          // Cập nhật lại bảng Available
          document.getElementById("av11").value = avail[0];
          document.getElementById("av12").value = avail[1];
          document.getElementById("av13").value = avail[2];

          safeSequence.push("P" + (i + 1)); // Thêm vào chuỗi an toàn
          f[i] = true; // Đánh dấu đã hoàn thành
          numFinished++; // Tăng số process hoàn thành
          found = true; // Đánh dấu đã tìm thấy
        }
      }
    }

    if (!found) {
      // Nếu không tìm thấy process nào có thể thực thi -> Deadlock
      const deadlockProcesses = [];
      // Tìm các process bị deadlock
      for (var i = 0; i < n; i++) {
        if (!f[i]) {
          deadlockProcesses.push("P" + (i + 1));
        }
      }

      alert(
        "Deadlock!!\nTiến trình an toàn tới: " +
          safeSequence.join(" -> ") +
          "\nTiến trình gặp Deadlock tại: " +
          deadlockProcesses.join(", ")
      );

      // Hiển thị các process đã thực thi thành công
      for (var i = 1; i <= safeSequence.length; i++) {
        document.getElementById("p" + i).value = safeSequence[i - 1];
      }

      document.body.style.backgroundColor = "#ff7171";
      return;
    }
  }

  // Nếu hệ thống an toàn
  document.body.style.backgroundColor = "#28df99";
  alert("Safe!! \nThứ tự an toàn là: " + safeSequence.join(" -> "));

  // Hiển thị thứ tự an toàn trong bảng Process Sequence
  for (var i = 1; i <= safeSequence.length; i++) {
    document.getElementById("p" + i).value = safeSequence[i - 1];
  }

  // Cập nhật bảng Available lần cuối
  document.getElementById("av11").value = avail[0];
  document.getElementById("av12").value = avail[1];
  document.getElementById("av13").value = avail[2];
}
