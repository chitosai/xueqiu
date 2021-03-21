let timelineCount = 0;
function _过滤新闻() {
    const nodes = document.querySelectorAll('.timeline__item');
    if( nodes.length === timelineCount ) {
        return;
    }
    timelineCount = nodes.length;
    nodes.forEach((node) => {
        const source = node.querySelector('.date-and-source');
        if( source.innerText.includes('新闻') ) {
            node.style.display = "none";
        }
    });
}

// ---

let portfolioCount = 0;
const portfolio = document.querySelector('.optional_stocks tbody');
async function _自选股增加PE() {
    const nodes = portfolio.querySelectorAll('tr');
    if( nodes.length === portfolioCount ) {
        return;
    }
    portfolioCount = nodes.length;
    // 成交量 -> 静态PE
    // 总市值 -> 预测PE
    const thead = document.querySelector('.optional_stocks :first-child');
    thead.children[3].children[0].innerText = '静态PE';
    thead.children[4].children[0].innerText = '预测PE';
    // -
    const sidArray = [];
    nodes.forEach(async (node) => {
        const sid = node.querySelector('.code span').innerText;
        node.setAttribute('sid', sid);
        sidArray.push(sid);
    });
    const sidString = sidArray.join(',');
    const r = await getStockInfo(sidString);
    const stockList = r.data.items;
    stockList.forEach((stock) => {
        const data = stock.quote;
        const node = portfolio.querySelector(`[sid='${data.symbol}']`);
        const staticPE = node.querySelector('td:nth-child(4)');
        // 大于50倍，或小于0倍的pe的显示为灰色
        if( data.pe_lyr > 40 || data.pe_lyr < 0 ) {
            staticPE.style.color = '#ccc';
        }
        staticPE.innerText = data.pe_lyr || '';
        const forecastPE = node.querySelector('td:nth-child(5)');
        if( data.pe_forecast > 40 || data.pe_forecast < 0 ) {
            forecastPE.style.color = '#ccc';
        }
        forecastPE.innerText = data.pe_forecast || '';
    });
}
async function getStockInfo(sid) {
    const r = await fetch('//stock.xueqiu.com/v5/stock/batch/quote.json?extend=detail&symbol=' + sid, {
        credentials: 'include'
    });
    const data = await r.json();
    return data;
}

// ---

function frame() {
    _过滤新闻();
    _自选股增加PE();
}

setInterval(frame, 300);