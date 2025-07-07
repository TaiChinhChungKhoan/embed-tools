
            {/* Economic Indicators Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <div className="text-center">
                        <div className="flex items-center justify-center mb-2">
                            <Activity className="w-5 h-5 text-blue-500 mr-2" />
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Tăng trưởng GDP</h3>
                        </div>
                        <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                            {currentIndicators.gdp?.gdp?.toFixed(1)}%
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {currentIndicators.gdp?.quarter} {currentIndicators.gdp?.date}
                        </p>
                    </div>
                </Card>
                <Card>
                    <div className="text-center">
                        <div className="flex items-center justify-center mb-2">
                            <DollarSign className="w-5 h-5 text-green-500 mr-2" />
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Tăng trưởng M2</h3>
                        </div>
                        <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                            {currentIndicators.m2Growth?.m2Growth?.toFixed(1)}%
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {currentIndicators.m2Growth?.date}
                        </p>
                    </div>
                </Card>
                <Card>
                    <div className="text-center">
                        <div className="flex items-center justify-center mb-2">
                            <ShoppingCart className="w-5 h-5 text-purple-500 mr-2" />
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Bán lẻ</h3>
                        </div>
                        <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                            {currentIndicators.retailGrowth?.retailGrowth?.toFixed(1)}%
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {currentIndicators.retailGrowth?.date}
                        </p>
                    </div>
                </Card>
                <Card>
                    <div className="text-center">
                        <div className="flex items-center justify-center mb-2">
                            <TrendingUp className="w-5 h-5 text-orange-500 mr-2" />
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">CPI</h3>
                        </div>
                        <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                            {currentIndicators.cpi?.cpi?.toFixed(1)}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {currentIndicators.cpi?.date}
                        </p>
                    </div>
                </Card>
            </div>

            {/* Economic Trends Charts - 2 per row */}
            <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                    Xu hướng Chỉ số Kinh tế Vĩ mô
                </h3>
                
                {/* Row 1: GDP and M2 Growth */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <h4 className="text-base font-semibold text-gray-700 dark:text-gray-200 mb-3">
                            Tăng trưởng GDP (Quý)
                        </h4>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={gdpData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)" />
                                    <XAxis 
                                        dataKey="date" 
                                        tick={{ fill: 'rgb(156 163 175)', fontSize: 11 }} 
                                        minTickGap={20}
                                        interval="preserveStartEnd"
                                    />
                                    <YAxis tick={{ fill: 'rgb(156 163 175)', fontSize: 11 }} />
                                    <Tooltip 
                                        contentStyle={{ 
                                            backgroundColor: 'rgba(31, 41, 55, 0.9)', 
                                            border: '1px solid rgba(128, 128, 128, 0.2)', 
                                            borderRadius: '0.5rem',
                                            color: '#fff'
                                        }}
                                        formatter={(value) => [value?.toFixed(1) + '%', 'GDP']}
                                        labelFormatter={(label) => `${label} (${gdpData.find(d => d.date === label)?.quarter || ''})`}
                                    />
                                    <Line 
                                        type="monotone" 
                                        dataKey="gdp" 
                                        stroke="#3b82f6" 
                                        strokeWidth={2} 
                                        dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3 }}
                                        name="GDP (%)" 
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>

                    <Card>
                        <h4 className="text-base font-semibold text-gray-700 dark:text-gray-200 mb-3">
                            Tăng trưởng Cung tiền M2 (YTD)
                        </h4>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={moneySupplyData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)" />
                                    <XAxis 
                                        dataKey="date" 
                                        tick={{ fill: 'rgb(156 163 175)', fontSize: 11 }} 
                                        minTickGap={20}
                                        interval="preserveStartEnd"
                                    />
                                    <YAxis tick={{ fill: 'rgb(156 163 175)', fontSize: 11 }} />
                                    <Tooltip 
                                        contentStyle={{ 
                                            backgroundColor: 'rgba(31, 41, 55, 0.9)', 
                                            border: '1px solid rgba(128, 128, 128, 0.2)', 
                                            borderRadius: '0.5rem',
                                            color: '#fff'
                                        }}
                                        formatter={(value) => [value?.toFixed(1) + '%', 'M2']}
                                        labelFormatter={(label) => `Tháng: ${label}`}
                                    />
                                    <Line 
                                        type="monotone" 
                                        dataKey="m2Growth" 
                                        stroke="#10b981" 
                                        strokeWidth={2} 
                                        dot={{ fill: '#10b981', strokeWidth: 2, r: 3 }}
                                        name="M2 (%)" 
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </div>

                {/* Row 2: Retail Sales and CPI */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <h4 className="text-base font-semibold text-gray-700 dark:text-gray-200 mb-3">
                            Tăng trưởng Bán lẻ theo Ngành (Năm)
                        </h4>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={retailData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)" />
                                    <XAxis 
                                        dataKey="date" 
                                        tick={{ fill: 'rgb(156 163 175)', fontSize: 11 }} 
                                        minTickGap={20}
                                        interval="preserveStartEnd"
                                    />
                                    <YAxis tick={{ fill: 'rgb(156 163 175)', fontSize: 11 }} />
                                    <Tooltip 
                                        contentStyle={{ 
                                            backgroundColor: 'rgba(31, 41, 55, 0.9)', 
                                            border: '1px solid rgba(128, 128, 128, 0.2)', 
                                            borderRadius: '0.5rem',
                                            color: '#fff'
                                        }}
                                        formatter={(value, name) => {
                                            const dataPoint = retailData.find(d => d[name] === value);
                                            const valueMap = {
                                                'total': 'totalValue',
                                                'service': 'serviceValue', 
                                                'commerce': 'commerceValue',
                                                'hospitality': 'hospitalityValue'
                                            };
                                            const absoluteValue = dataPoint?.[valueMap[name]];
                                            const nameMap = {
                                                'total': 'Tổng số',
                                                'service': 'Dịch vụ & du lịch',
                                                'commerce': 'Thương nghiệp',
                                                'hospitality': 'Khách sạn nhà hàng'
                                            };
                                            return [
                                                `${value?.toFixed(1)}% (${absoluteValue?.toLocaleString()} Tỷ VNĐ)`, 
                                                nameMap[name] || name
                                            ];
                                        }}
                                        labelFormatter={(label) => `Năm: ${label}`}
                                    />
                                    <Legend />
                                    <Line 
                                        type="monotone" 
                                        dataKey="total" 
                                        stroke="#8b5cf6" 
                                        strokeWidth={3} 
                                        dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 3 }}
                                        name="Tổng số" 
                                    />
                                    <Line 
                                        type="monotone" 
                                        dataKey="commerce" 
                                        stroke="#10b981" 
                                        strokeWidth={2} 
                                        dot={{ fill: '#10b981', strokeWidth: 2, r: 2 }}
                                        name="Thương nghiệp" 
                                    />
                                    <Line 
                                        type="monotone" 
                                        dataKey="service" 
                                        stroke="#f59e0b" 
                                        strokeWidth={2} 
                                        dot={{ fill: '#f59e0b', strokeWidth: 2, r: 2 }}
                                        name="Dịch vụ & du lịch" 
                                    />
                                    <Line 
                                        type="monotone" 
                                        dataKey="hospitality" 
                                        stroke="#ef4444" 
                                        strokeWidth={2} 
                                        dot={{ fill: '#ef4444', strokeWidth: 2, r: 2 }}
                                        name="Khách sạn nhà hàng" 
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>

                    <Card>
                        <h4 className="text-base font-semibold text-gray-700 dark:text-gray-200 mb-3">
                            Chỉ số Giá Tiêu dùng (CPI)
                        </h4>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={cpiData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)" />
                                    <XAxis 
                                        dataKey="date" 
                                        tick={{ fill: 'rgb(156 163 175)', fontSize: 11 }} 
                                        minTickGap={20}
                                        interval="preserveStartEnd"
                                    />
                                    <YAxis tick={{ fill: 'rgb(156 163 175)', fontSize: 11 }} />
                                    <Tooltip 
                                        contentStyle={{ 
                                            backgroundColor: 'rgba(31, 41, 55, 0.9)', 
                                            border: '1px solid rgba(128, 128, 128, 0.2)', 
                                            borderRadius: '0.5rem',
                                            color: '#fff'
                                        }}
                                        formatter={(value) => [value?.toFixed(1), 'CPI']}
                                        labelFormatter={(label) => `Tháng: ${label}`}
                                    />
                                    <Line 
                                        type="monotone" 
                                        dataKey="cpi" 
                                        stroke="#f59e0b" 
                                        strokeWidth={2} 
                                        dot={{ fill: '#f59e0b', strokeWidth: 2, r: 3 }}
                                        name="CPI" 
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </div>
            </div>
