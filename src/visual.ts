"use strict";

import "core-js/stable";
import "./../style/visual.less";
import powerbi from "powerbi-visuals-api";
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import IVisualHost = powerbi.extensibility.visual.IVisualHost;

import { select, Selection, scaleBand, scaleLinear, max, axisBottom } from 'd3';

export class Visual implements IVisual {

    private svg: Selection<SVGElement, any, any, any>;
    private barContainer: Selection<SVGElement, any, any, any>;
    private axis: Selection<SVGElement, any, any, any>;
    private host: IVisualHost;

    constructor(options: VisualConstructorOptions) {

        //colors - use powerbi host: general power bi programm
        this.host = options.host;


        this.svg = select(options.element)
            .append('svg');

        this.barContainer = this.svg.append('g');
        // g stands for group

        //x-Axis
        this.axis = this.svg.append('g')

    }

    public update(options: VisualUpdateOptions) {

        const width = options.viewport.width;
        const height = options.viewport.height;

        const extractedData = [];
        //  console.log(options.dataViews);

        if (options.dataViews
            && options.dataViews[0]
            && options.dataViews[0].categorical
            && options.dataViews[0].categorical.categories
            && options.dataViews[0].categorical.values) {



            const categoricalData = options.dataViews[0].categorical;
            const category = categoricalData.categories[0];
            const datavalue = categoricalData.values[0];

            for (let i = 0; i < category.values.length; i++) {
                extractedData.push({
                    category: category.values[i],
                    value: datavalue.values[i],
                    color: this.host.colorPalette.getColor(category.values[i] as string).value
                });
            }
        }

        const x = scaleBand()
            .domain(extractedData //which data will be scaled
                .map(dataPoint => dataPoint.category))
            .rangeRound([0, width])//which available space
            .padding(0.1)
            ;

        const y = scaleLinear()
            .domain([0, max(extractedData, dataPoint => dataPoint.value) + 2])
            .range([height - 20, 0]);

        const xAxis = axisBottom(x);
        this.axis.call(xAxis).attr('transform', `translate(0, ${height - 20})`);

        this.svg.attr('width', width).attr('height', height);

        const bars = this.barContainer.selectAll('.bar')
            .data(extractedData);

        bars.enter() //how many bars should enter the screen
            .append('rect')
            .classed('bar', true)
            .attr('width', x.bandwidth()) //equal width for each bar
            .attr('height', dataPoint => height - 20 - y(dataPoint.value))
            .attr('x', dataPoint => x(dataPoint.category))
            .attr('y', dataPoint => y(dataPoint.value))
            .attr('fill', dataPoint => dataPoint.color);

        bars //will add bar class to every rectangle 
            .attr('width', x.bandwidth()) //equal width for each bar
            .attr('height', dataPoint => height - 20 - y(dataPoint.value))
            .attr('x', dataPoint => x(dataPoint.category))
            .attr('y', dataPoint => y(dataPoint.value))
            ;

        //reloading
        bars.exit().remove();
    }

}