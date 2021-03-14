let timelineCount = 0;
function filter() {
    const nodes = document.querySelectorAll('.timeline__item');
    if( nodes.length === timelineCount ) {
        return;
    }
    timelineCount = nodes.length;
    console.log('update!')
    nodes.forEach((node) => {
        const source = node.querySelector('.date-and-source');
        if( source.innerText.includes('新闻') ) {
            node.style.display = "none";
        }
    });
}

setInterval(filter, 300);