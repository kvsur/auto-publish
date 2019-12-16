import React from "react";
import { connect } from "dva";

@connect(({report}) => ({
  ...report
}))
class Report extends React.Component {
  async componentDidMount() {
    const colors = [
      '#77C34F',
      '#5E8579',
      '#F6D6FF',
      '#F2753F',
      '#2E68AA',
      '#9FF048',
      '#56A36C',
      '#7E884F',
      '#82A6F5',
      '#EAF048',
      '#2A5200',
      '#B85A9A',
      '#9C2189',
      '#9E026D',
      '#B8288A',
      '#CC2F69',
      '#C9BF8E',
      '#CA836F',
      '#BF6A55',
      '#823E35',
    ];
    await this.props.dispatch({
			type: 'report/fetchReport',
		});
    const { userReport, projectReport, brokerMax } = this.props;
    console.log(brokerMax)

    new window.roughViz.StackedBar({
      element: '#projectReport',
      data: projectReport.concat(projectReport),
      margin: {top: 50, bottom: 100, left: 50, right: 50},
      labels: 'projectName',
      title: 'Project Deploy Report Data',
      titleFontSize: '1.5rem',
      height: 250 + brokerMax,
      // width: 250 + (20 * projectReport.length || 1),
      width: 500,
      roughness: 3,
      colors,
      padding: 0.3,
      fillWeight: 1,
      strokeWidth: 1,
      fillStyle: 'cross-hatch',
      stroke: 'black',
    });

    new window.roughViz.Pie(
      {
        element: '#userReport',
        titleFontSize: '1.5rem',
        margin: {top: 50, bottom: 50, left: 40, right: 10},
        data: userReport,
        height: 300,
        width: 400,
        colors,
        title: "User Deploy Report Data",
        roughness: 3,
        strokeWidth: 3,
        innerStrokeWidth: 2,
      }
    );
  }
  render() {
    return (
      <div style={{display: 'flex', flexWrap: 'nowrap', alignItems: 'flex-end', justifyContent: 'space-evenly'}}>
        <div id="projectReport"></div>
        <div id="userReport"></div>
      </div>
    );
  }
}

export default Report;
