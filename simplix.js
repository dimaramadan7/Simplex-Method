function solveLP() {
    // الحصول على قيم من الواجهة وتحويلها الى مصفوفات
    const c = document.getElementById('c').value.split(' ').map(Number);
    const A = document.getElementById('A').value.split('\n').map(row => row.split(' ').map(Number));
    const b = document.getElementById('b').value.split(' ').map(Number);

    const n = c.length; //col
    const m = A.length; //row

    // جدول سيملكس الاول
    // انشاء مصفوفة وملأها بقيم الصفر
    const tableau = new Array(m + 1);

    for (let i = 0; i < m + 1; i++) {
        tableau[i] = new Array(n + m + 1).fill(0);
    }

    // ملأ المصفوفة بقيم المصفوفات A b c
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            tableau[i][j] = A[i][j];
        }
        tableau[i][n + i] = 1;
        tableau[i][n + m] = b[i];
    }

    for (let j = 0; j < n; j++) {
        tableau[m][j] = -c[j];
    }

    for (let j = 0; j < n + m; j++) {
        for (let i = 0; i < m; i++) {
            tableau[m][j] -= tableau[i][j];
        }
    }

    // ************************ //
    let pivotColumn;
    // يحتوي على أصغر قيمة سالبة pivotColumn
    //ايجاد متغير الدخل
    while ((pivotColumn = tableau[m].findIndex(x => x < 0)) >= 0) {
        // يحتوي على أصغر نسبة موجبة
        let pivotRow = -1;
        for (let i = 0; i < m; i++) {
            if (tableau[i][pivotColumn] > 0) {
                if (pivotRow === -1) {
                    pivotRow = i;
                } else {
                    const ratio = tableau[i][n + m] / tableau[i][pivotColumn];
                    const currentRatio = tableau[pivotRow][n + m] / tableau[pivotRow][pivotColumn];
                    if (ratio < currentRatio) {
                        pivotRow = i;
                    }
                }
            }
        }

        // إذا لم يتم العثور على صف بادئ، يعني ذلك أن المسألة غير محدودة.
        if (pivotRow === -1) {
            document.getElementById('result').textContent = 'The problem is unbounded';
            return;
        }

        // تحديث المصفوفة للعثور على حل افضل 
        const pivotValue = tableau[pivotRow][pivotColumn];
        for (let j = 0; j < n + m + 1; j++) {
            tableau[pivotRow][j] /= pivotValue;
        }
        for (let i = 0; i < m + 1; i++) {
            if (i !== pivotRow) {
                const factor = tableau[i][pivotColumn];
                for (let j = 0; j < n + m + 1; j++) {
                    tableau[i][j] -= factor * tableau[pivotRow][j];
                }
            }
        }
    }


    // تخزين القيم النهائية للمتغيرات والقيمة الهدف.
    const result = {};
    for (let i = 0; i < m; i++) {
        // استخراج قيم المتغيرات و z وتخزينها في result
        const varIndex = tableau[i].findIndex((x, j) => x === 1 && j < n);

        result[`x${varIndex + 1}`] = tableau[i][n + m];
    }
    result.z = tableau[m][n + m];

    // تحديث عنصر HTML بالمعرف `'result'` لعرض النتائج
    document.getElementById('result').innerHTML = `
        x1: ${result.x1}<br>
        x2: ${result.x2}<br>
        z: ${result.z}
    `;
}