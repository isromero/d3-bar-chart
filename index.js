const App = () => {
  const [gdpData, setGdpData] = React.useState([]);
  React.useEffect(() => {
    async function fetchData() {
      const response = await fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json');
      const data = await response.json();
      setGdpData(data.data);
    }
    fetchData();
  }, []);

  return (
    <div>
      <Chart data={gdpData} width={1200} height={600} />
    </div>
  )
}

const Chart = ({ data, width, height }) => {
    React.useEffect(() => {
            createChart();
    }, [data]);

  const createChart = () => {
    const margin = { top: 20, right: 20, bottom: 20, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const xScale = d3.scaleTime()
      .domain(d3.extent(data, d => new Date(d[0])))
      .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d[1])])
      .range([height - margin.bottom, margin.top]);

    let tooltip = d3.select('.holding')
        .append('div')
        .attr('id', 'tooltip')
        .style('opacity', 0);

    d3.select('svg')
      .selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .classed('bar', true)
      .attr('x', d => xScale(new Date(d[0])))
      .attr('y', d => yScale(d[1]))
      .attr('width', 3)
      .attr('height', d => height - margin.bottom - yScale(d[1]))
      .attr('data-date', (d, i) => data[i][0])
      .attr('data-gdp', (d, i) => data[i][1])
      .on('mouseover', (d) => {
        tooltip.html(d[0] + '<br>' + '$' + d[1] + ' Billion')
            .attr('data-date', d[0])
            .style('left', (d3.event.pageX - document.getElementById('container').offsetLeft + 30) + 'px')
            .style('top', (d3.event.pageY - document.getElementById('container').offsetTop + 20) + 'px');
        tooltip.transition()
            .style('opacity', 0.9);
      })
      .on('mouseout', () => {
        tooltip.transition()
            .duration(200)
            .style('opacity', 0);
    });
  
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    d3.select('svg')
        .append('g')
        .attr('id', 'x-axis')
        .attr('transform', `translate(0, ${height - margin.bottom})`)
        .call(xAxis)
        .selectAll('.tick')
        .classed('x-axis-tick', true);

    d3.select('svg')
        .append('g')
        .attr('id', 'y-axis')
        .attr('transform', `translate(${margin.left}, 0)`)
        .call(yAxis)
        .selectAll('.tick')
        .classed('x-axis-tick', true);
  }

  return (
    <div id="container">
        <h2 id="title">United States GDP</h2>
        <div className="holding">
            <svg width={width} height={height}/>
        </div>
    </div>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
