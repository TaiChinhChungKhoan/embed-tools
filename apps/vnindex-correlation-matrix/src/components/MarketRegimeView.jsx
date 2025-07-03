import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@embed-tools/components';
import { RotateCcw } from 'lucide-react';
import * as d3 from 'd3';

const MarketRegimeView = ({ data, onTimeFilter, onClearFilter, timeFilter }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!data || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const { dates, correlations, statistics } = data;
    const chartData = dates.map((d, i) => ({ 
      date: new Date(d), 
      correlation: correlations[i] 
    }));

    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const width = svgRef.current.clientWidth - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const g = svg
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const xScale = d3.scaleTime()
      .domain(d3.extent(chartData, d => d.date))
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([0, 1])
      .range([height, 0]);

    // Draw area
    const area = d3.area()
      .x(d => xScale(d.date))
      .y0(height)
      .y1(d => yScale(d.correlation));

    g.append('path')
      .datum(chartData)
      .attr('fill', 'rgba(0, 212, 255, 0.1)')
      .attr('d', area);

    // Draw line
    const line = d3.line()
      .x(d => xScale(d.date))
      .y(d => yScale(d.correlation));

    g.append('path')
      .datum(chartData)
      .attr('fill', 'none')
      .attr('stroke', '#00d4ff')
      .attr('stroke-width', 1.5)
      .attr('d', line);

    // Draw mean line
    g.append('line')
      .attr('x1', 0)
      .attr('x2', width)
      .attr('y1', yScale(statistics.mean))
      .attr('y2', yScale(statistics.mean))
      .attr('stroke', '#ff4444')
      .attr('stroke-dasharray', '5,5');

    // Add axes
    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale));

    g.append('g')
      .call(d3.axisLeft(yScale));

    // Add brush for time filtering
    const brush = d3.brushX()
      .extent([[0, 0], [width, height]])
      .on('end', (event) => {
        if (event.selection) {
          const [x0, x1] = event.selection;
          const dateRange = [xScale.invert(x0), xScale.invert(x1)];
          onTimeFilter(dateRange);
        }
      });

    g.append('g')
      .attr('class', 'brush')
      .call(brush);

    // Add labels
    g.append('text')
      .attr('x', width / 2)
      .attr('y', -5)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('fill', '#888')
      .text('Tương Quan Thị Trường Theo Thời Gian');

    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left)
      .attr('x', 0 - (height / 2))
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('fill', '#888')
      .text('Hệ Số Tương Quan');

  }, [data, onTimeFilter]);

  if (!data) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Không có dữ liệu trạng thái thị trường
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Trạng Thái Tương Quan Thị Trường</CardTitle>
          <Button variant="outline" onClick={onClearFilter} size="sm">
            <RotateCcw className="h-4 w-4 mr-2" />
            Thiết Lập Lại Lựa Chọn
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {timeFilter && (
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-sm">
                <strong>Bộ lọc thời gian:</strong> {timeFilter[0].toLocaleDateString()} - {timeFilter[1].toLocaleDateString()}
              </p>
            </div>
          )}
          <div className="bg-muted/50 rounded-lg p-4">
            <svg ref={svgRef} className="w-full"></svg>
          </div>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="font-semibold text-primary">{data.statistics.mean.toFixed(3)}</div>
              <div className="text-muted-foreground">Tương Quan Trung Bình</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-primary">{data.statistics.std.toFixed(3)}</div>
              <div className="text-muted-foreground">Độ Lệch Chuẩn</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-primary">{data.statistics.min.toFixed(3)} - {data.statistics.max.toFixed(3)}</div>
              <div className="text-muted-foreground">Khoảng Tương Quan</div>
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-2">
            <h4 className="font-semibold text-blue-800 mb-2">ℹ️ Hướng Dẫn Sử Dụng Biểu Đồ</h4>
            <ul className="list-disc list-inside text-blue-700 text-sm space-y-1">
              <li>Biểu đồ thể hiện sự thay đổi hệ số tương quan trung bình của thị trường theo thời gian.</li>
              <li>Kéo chọn vùng trên biểu đồ để lọc theo khoảng thời gian mong muốn.</li>
              <li>Đường kẻ đỏ là giá trị trung bình toàn kỳ.</li>
              <li>Di chuột để xem chi tiết từng điểm dữ liệu.</li>
            </ul>
            <div className="mt-3 text-blue-900 text-sm">
              <strong>Cách đọc biểu đồ:</strong>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li><strong>Hệ số tương quan cao</strong> (gần 1): Các cổ phiếu trong rổ di chuyển cùng chiều, thị trường đồng thuận mạnh. Thường xuất hiện trong các giai đoạn tăng/giảm mạnh hoặc có tin tức vĩ mô lớn.</li>
                <li><strong>Hệ số tương quan thấp</strong> (gần 0): Các cổ phiếu phân hóa, ít đồng thuận. Thường gặp trong giai đoạn thị trường đi ngang hoặc dòng tiền phân hóa.</li>
                <li><strong>Quan sát sự thay đổi</strong>: Khi hệ số tăng đột biến hoặc giảm mạnh, có thể báo hiệu sự chuyển pha của thị trường.</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketRegimeView; 