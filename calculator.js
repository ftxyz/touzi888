function calculateInvestment() {
    const targetAmount = parseFloat(document.getElementById('targetAmount').value) * 10000;
    const initialAmount = parseFloat(document.getElementById('initialAmount').value) * 10000;
    const years = parseInt(document.getElementById('years').value);
    const annualRate = parseFloat(document.getElementById('annualRate').value) / 100;

    if (!targetAmount || !years || annualRate === undefined) {
        alert('请填写完整的投资信息！');
        return;
    }

    if (targetAmount <= initialAmount) {
        alert('目标金额必须大于初始资金！');
        return;
    }

    const futureValueInitial = initialAmount * Math.pow(1 + annualRate, years);
    const remainingAmount = targetAmount - futureValueInitial;

    if (remainingAmount <= 0) {
        alert('初始资金在复利作用下已达到目标，无需额外投入！');
        return;
    }

    const annuityFactor = (Math.pow(1 + annualRate, years) - 1) / annualRate;
    const yearlyInvestment = remainingAmount / annuityFactor;
    const monthlyInvestment = yearlyInvestment / 12;
    const weeklyInvestment = yearlyInvestment / 52;
    const dailyInvestment = yearlyInvestment / 365;

    displayResults({
        yearly: yearlyInvestment,
        monthly: monthlyInvestment,
        weekly: weeklyInvestment,
        daily: dailyInvestment,
        years: years,
        target: targetAmount
    });

    generateYearlyDetails(initialAmount, yearlyInvestment, annualRate, years);
}

function displayResults(results) {
    document.getElementById('yearlyAmount').textContent = formatCurrency(results.yearly);
    document.getElementById('monthlyAmount').textContent = formatCurrency(results.monthly);
    document.getElementById('weeklyAmount').textContent = formatCurrency(results.weekly);
    document.getElementById('dailyAmount').textContent = formatCurrency(results.daily);
    
    document.getElementById('dailyHighlight').textContent = formatCurrency(results.daily);
    document.getElementById('yearsHighlight').textContent = results.years;
    document.getElementById('targetHighlight').textContent = formatCurrency(results.target, true);

    // 显示结果区域
    document.querySelector('.empty-state').style.display = 'none';
    document.getElementById('resultCard').style.display = 'block';
    document.getElementById('detailsSection').style.display = 'block';
}

function formatCurrency(amount, isLarge = false) {
    if (isLarge && amount >= 10000) {
        return (amount / 10000).toFixed(1) + '万';
    }
    return '¥' + Math.round(amount).toLocaleString();
}

function showDetails() {
    const details = document.getElementById('details');
    if (details.style.display === 'none') {
        details.style.display = 'block';
        document.querySelector('button[onclick="showDetails()"]').textContent = '隐藏详细计划';
    } else {
        details.style.display = 'none';
        document.querySelector('button[onclick="showDetails()"]').textContent = '查看详细计划';
    }
}

function generateYearlyDetails(initialAmount, yearlyInvestment, annualRate, years) {
    let currentAmount = initialAmount;
    let detailsHtml = '<div class="details-table">';
    
    detailsHtml += '<div class="table-header">';
    detailsHtml += '<span>年份</span>';
    detailsHtml += '<span>年初金额</span>';
    detailsHtml += '<span>年度投入</span>';
    detailsHtml += '<span>年度收益</span>';
    detailsHtml += '<span>年末金额</span>';
    detailsHtml += '</div>';
    
    for (let year = 1; year <= years; year++) {
        const startAmount = currentAmount;
        const yearReturn = (startAmount + yearlyInvestment / 2) * annualRate;
        currentAmount = startAmount + yearlyInvestment + yearReturn;
        
        detailsHtml += '<div class="table-row">';
        detailsHtml += `<span>第${year}年</span>`;
        detailsHtml += `<span>${formatCurrency(startAmount, true)}</span>`;
        detailsHtml += `<span>${formatCurrency(yearlyInvestment)}</span>`;
        detailsHtml += `<span>${formatCurrency(yearReturn)}</span>`;
        detailsHtml += `<span>${formatCurrency(currentAmount, true)}</span>`;
        detailsHtml += '</div>';
    }
    
    detailsHtml += '</div>';
    document.getElementById('yearlyDetails').innerHTML = detailsHtml;
}

function formatCurrency(amount, isLarge = false) {
    if (isLarge && amount >= 10000) {
        return (amount / 10000).toFixed(1) + '万';
    }
    return '¥' + Math.round(amount).toLocaleString();
}

document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('input[type="number"]');
    inputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                calculateInvestment();
            }
        });
    });
});