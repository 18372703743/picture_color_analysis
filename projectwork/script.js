let myChart = null;

// 1. K-means 聚类算法实现
function kMeans(data, k, maxIter = 10) {
    // 随机初始化中心点
    let centroids = data.slice(0, k).map(p => [...p]);
    let labels = new Array(data.length);

    for (let iter = 0; iter < maxIter; iter++) {
        // 分配步骤
        for (let i = 0; i < data.length; i++) {
            let minDist = Infinity;
            for (let j = 0; j < k; j++) {
                let d = Math.hypot(data[i][0]-centroids[j][0], data[i][1]-centroids[j][1], data[i][2]-centroids[j][2]);
                if (d < minDist) { minDist = d; labels[i] = j; }
            }
        }
        // 更新步骤
        let newCentroids = Array.from({length: k}, () => [0, 0, 0, 0]); // r,g,b,count
        for (let i = 0; i < data.length; i++) {
            let l = labels[i];
            newCentroids[l][0] += data[i][0];
            newCentroids[l][1] += data[i][1];
            newCentroids[l][2] += data[i][2];
            newCentroids[l][3]++;
        }
        centroids = newCentroids.map(c => c[3] === 0 ? [0,0,0] : [c[0]/c[3], c[1]/c[3], c[2]/c[3]]);
    }
    
    // 计算每个簇的数量
    let counts = new Array(k).fill(0);
    labels.forEach(l => counts[l]++);
    return { centroids, counts };
}

// 2. RGB 转 LAB (简化版)
function rgbToLab(r, g, b) {
    // 这里建议搜索标准的 RGB -> XYZ -> LAB 转换公式，篇幅原因此处展示逻辑框架
    // ...转换代码...
    return [L, a, b];
}

// 3. 处理图片
async function processImage() {
    const file = document.getElementById('upload').files[0];
    if (!file) return alert("请先选择图片");

    const k = parseInt(document.getElementById('kValue').value);
    const space = document.getElementById('colorSpace').value;
    
    const img = document.getElementById('preview');
    img.src = URL.createObjectURL(file);
    img.onload = () => {
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 100; // 缩小处理以提高速度
        canvas.height = 100;
        ctx.drawImage(img, 0, 0, 100, 100);
        
        const imageData = ctx.getImageData(0, 0, 100, 100).data;
        let pixels = [];
        for (let i = 0; i < imageData.length; i += 4) {
            pixels.push([imageData[i], imageData[i+1], imageData[i+2]]);
        }

        // 进行聚类
        const result = kMeans(pixels, k);
        updateChart(result);
        askAI(result.centroids);
    };
    img.style.display = 'block';
}

// 4. 更新 ECharts
function updateChart(result) {
    const chartType = document.getElementById('chartType').value;
    const chartDom = document.getElementById('chart-container');
    if (!myChart) myChart = echarts.init(chartDom);

    const data = result.centroids.map((c, i) => ({
        value: result.counts[i],
        name: `颜色 ${i+1}`,
        itemStyle: { color: `rgb(${Math.round(c[0])},${Math.round(c[1])},${Math.round(c[2])})` }
    }));

    const option = {
        title: { text: '图片颜色分布' },
        tooltip: {},
        series: [{
            type: chartType === 'pie' ? 'pie' : 'bar',
            data: data,
            radius: '50%'
        }]
    };
    if(chartType === 'bar') {
        option.xAxis = { type: 'category' };
        option.yAxis = { type: 'value' };
    }
    myChart.setOption(option, true);
}

// 5. 调用 AI 进行配色分析 ✨ (已实现)
async function askAI(colorCentroids) {
    try {
        // 显示加载状态
        const aiText = document.getElementById('ai-text');
        aiText.textContent = '🔄 AI 正在分析配色方案...';
        
        // 格式化颜色数据
        const colorsText = colorCentroids.map((c, i) => 
            `颜色${i+1}: RGB(${Math.round(c[0])}, ${Math.round(c[1])}, ${Math.round(c[2])})`
        ).join('\n');
        
        // 调用后端 API
        const response = await fetch('http://localhost:5000/api/color-analysis', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                colors_text: colorsText
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            aiText.innerHTML = result.analysis.replace(/\n/g, '<br>');
            console.log(`✅ Token使用: ${result.tokens_used}`);
        } else {
            aiText.textContent = `❌ AI 分析失败: ${result.error}`;
        }
        
    } catch (error) {
        console.error('❌ 调用 AI 失败:', error);
        document.getElementById('ai-text').textContent = 
            `❌ 连接失败: ${error.message}\n请确认后端服务器是否运行（localhost:5000）`;
    }
}