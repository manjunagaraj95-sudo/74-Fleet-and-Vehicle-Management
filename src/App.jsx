
import React, { useState, useEffect } from 'react';

// STRCIT ENGINEERING & ERROR PREVENTION RULE: Centralized Routing
// Global Configuration
const ROLES = {
  ADMIN: 'Admin',
  FLEET_MANAGER: 'Fleet Manager',
  DRIVER: 'Driver',
  MAINTENANCE_TEAM: 'Maintenance Team',
  OPERATIONS_TEAM: 'Operations Team',
};

// Sample Data (Embedded as per instructions)
const SAMPLE_VEHICLES = [
  {
    id: 'VCL001', licensePlate: 'ABC-1234', make: 'Toyota', model: 'Camry', year: 2020, status: 'Approved', driverId: 'DRV001',
    mileage: 45000, fuelLevel: 0.75, lastMaintenance: '2023-01-15', nextMaintenance: '2024-01-15',
    workflow: {
      currentStage: 'Approved for Use',
      stages: [
        { name: 'Registration Initiated', date: '2023-01-01', status: 'completed', sla: 'met' },
        { name: 'Documentation Review', date: '2023-01-05', status: 'completed', sla: 'met' },
        { name: 'Vehicle Inspection', date: '2023-01-10', status: 'completed', sla: 'met' },
        { name: 'Approved for Use', date: '2023-01-12', status: 'current', sla: 'met' }
      ]
    },
    relatedRecords: {
      drivers: [{ id: 'DRV001', name: 'Alice Smith' }],
      maintenance: [{ id: 'MNT001', type: 'Oil Change' }, { id: 'MNT002', type: 'Tire Rotation' }],
      fuelLogs: [{ id: 'FLL001', date: '2024-05-10' }]
    },
    documents: [{ name: 'Vehicle Registration.pdf', url: '#', type: 'pdf' }]
  },
  {
    id: 'VCL002', licensePlate: 'XYZ-5678', make: 'Ford', model: 'Transit', year: 2019, status: 'In Progress', driverId: null,
    mileage: 60000, fuelLevel: 0.50, lastMaintenance: '2022-11-20', nextMaintenance: '2023-11-20',
    workflow: {
      currentStage: 'Pending Driver Assignment',
      stages: [
        { name: 'Registration Initiated', date: '2023-01-10', status: 'completed', sla: 'met' },
        { name: 'Documentation Review', date: '2023-01-15', status: 'completed', sla: 'met' },
        { name: 'Vehicle Inspection', date: '2023-01-20', status: 'completed', sla: 'met' },
        { name: 'Pending Driver Assignment', date: '2023-01-22', status: 'current', sla: 'pending' }
      ]
    },
    relatedRecords: { drivers: [], maintenance: [{ id: 'MNT003', type: 'Engine Check' }], fuelLogs: [] },
    documents: [{ name: 'Inspection Report.pdf', url: '#', type: 'pdf' }]
  },
  {
    id: 'VCL003', licensePlate: 'PQR-9012', make: 'Mercedes-Benz', model: 'Sprinter', year: 2021, status: 'Pending', driverId: 'DRV002',
    mileage: 20000, fuelLevel: 0.90, lastMaintenance: '2023-03-01', nextMaintenance: '2024-03-01',
    workflow: {
      currentStage: 'Approval Pending',
      stages: [
        { name: 'Registration Initiated', date: '2023-02-01', status: 'completed', sla: 'met' },
        { name: 'Documentation Review', date: '2023-02-05', status: 'completed', sla: 'met' },
        { name: 'Approval Pending', date: '2023-02-07', status: 'current', sla: 'pending' }
      ]
    },
    relatedRecords: { drivers: [{ id: 'DRV002', name: 'Bob Johnson' }], maintenance: [], fuelLogs: [] },
    documents: []
  },
  {
    id: 'VCL004', licensePlate: 'GHI-3456', make: 'Honda', model: 'CR-V', year: 2018, status: 'Rejected', driverId: 'DRV003',
    mileage: 75000, fuelLevel: 0.20, lastMaintenance: '2023-04-10', nextMaintenance: '2024-04-10',
    workflow: {
      currentStage: 'Rejected - Awaiting Disposal',
      stages: [
        { name: 'Registration Initiated', date: '2023-03-01', status: 'completed', sla: 'met' },
        { name: 'Documentation Review', date: '2023-03-05', status: 'completed', sla: 'met' },
        { name: 'Vehicle Inspection', date: '2023-03-10', status: 'completed', sla: 'met' },
        { name: 'Rejected - Awaiting Disposal', date: '2023-03-12', status: 'current', sla: 'breached' }
      ]
    },
    relatedRecords: { drivers: [{ id: 'DRV003', name: 'Charlie Brown' }], maintenance: [{ id: 'MNT004', type: 'Brake Replacement' }], fuelLogs: [{ id: 'FLL003', date: '2024-04-01' }] },
    documents: [{ name: 'Rejection Notice.pdf', url: '#', type: 'pdf' }]
  },
  {
    id: 'VCL005', licensePlate: 'KLM-7890', make: 'BMW', model: 'X5', year: 2022, status: 'Exception', driverId: 'DRV004',
    mileage: 15000, fuelLevel: 0.85, lastMaintenance: '2023-05-01', nextMaintenance: '2024-05-01',
    workflow: {
      currentStage: 'Exception - Legal Review',
      stages: [
        { name: 'Registration Initiated', date: '2023-04-01', status: 'completed', sla: 'met' },
        { name: 'Documentation Review', date: '2023-04-05', status: 'completed', sla: 'met' },
        { name: 'Exception - Legal Review', date: '2023-04-07', status: 'current', sla: 'breached' }
      ]
    },
    relatedRecords: { drivers: [{ id: 'DRV004', name: 'Diana Prince' }], maintenance: [], fuelLogs: [] },
    documents: [{ name: 'Legal Report.pdf', url: '#', type: 'pdf' }]
  }
];

const SAMPLE_DRIVERS = [
  { id: 'DRV001', name: 'Alice Smith', license: 'DLR-12345', status: 'Active', vehicleId: 'VCL001' },
  { id: 'DRV002', name: 'Bob Johnson', license: 'DLR-67890', status: 'Active', vehicleId: 'VCL003' },
  { id: 'DRV003', name: 'Charlie Brown', license: 'DLR-11223', status: 'Active', vehicleId: 'VCL004' },
  { id: 'DRV004', name: 'Diana Prince', license: 'DLR-44556', status: 'Active', vehicleId: 'VCL005' },
];

const SAMPLE_MAINTENANCE = [
  { id: 'MNT001', vehicleId: 'VCL001', type: 'Oil Change', date: '2023-01-15', status: 'Completed', cost: 120 },
  { id: 'MNT002', vehicleId: 'VCL001', type: 'Tire Rotation', date: '2023-01-15', status: 'Completed', cost: 80 },
  { id: 'MNT003', vehicleId: 'VCL002', type: 'Engine Check', date: '2022-11-20', status: 'Completed', cost: 350 },
  { id: 'MNT004', vehicleId: 'VCL004', type: 'Brake Replacement', date: '2023-04-10', status: 'Completed', cost: 500 },
];

const SAMPLE_ACTIVITIES = [
  { id: 'ACT001', type: 'Vehicle Registered', entity: 'VCL001', user: 'Admin', timestamp: '2024-05-15T10:00:00Z', description: 'New vehicle Toyota Camry (ABC-1234) registered.' },
  { id: 'ACT002', type: 'Maintenance Scheduled', entity: 'MNT001', user: 'Fleet Manager', timestamp: '2024-05-15T11:30:00Z', description: 'Oil Change scheduled for VCL001.' },
  { id: 'ACT003', type: 'Driver Assigned', entity: 'VCL001', user: 'Fleet Manager', timestamp: '2024-05-15T12:45:00Z', description: 'Alice Smith assigned to VCL001.' },
  { id: 'ACT004', type: 'Status Update', entity: 'VCL003', user: 'Admin', timestamp: '2024-05-15T14:10:00Z', description: 'Vehicle PQR-9012 status changed to Pending Approval.' },
  { id: 'ACT005', type: 'Alert Triggered', entity: 'VCL004', user: 'System', timestamp: '2024-05-15T15:00:00Z', description: 'SLA breach detected for VCL004 workflow.' },
  { id: 'ACT006', type: 'Fuel Log Added', entity: 'VCL001', user: 'Driver', timestamp: '2024-05-15T16:00:00Z', description: 'Fuel log for VCL001 added: 50 Liters.' },
  { id: 'ACT007', type: 'Vehicle Status Changed', entity: 'VCL002', user: 'Fleet Manager', timestamp: '2024-05-16T09:00:00Z', description: 'VCL002 status updated to "In Progress".' },
  { id: 'ACT008', type: 'Document Uploaded', entity: 'VCL001', user: 'Admin', timestamp: '2024-05-16T10:00:00Z', description: 'Uploaded "Vehicle Registration.pdf" for VCL001.' },
  { id: 'ACT009', type: 'Maintenance Completed', entity: 'MNT001', user: 'Maintenance Team', timestamp: '2024-05-16T11:00:00Z', description: 'Maintenance MNT001 completed for VCL001.' },
];

// Helper Components
const StatusIndicator = ({ status }) => {
  return (
    <span className={`status-indicator ${status?.replace(/\s+/g, '-')}`}
      style={{
        marginRight: 'var(--spacing-sm)',
        textTransform: 'capitalize',
        fontWeight: 'var(--font-weight-semibold)'
      }}>
      <span style={{ marginRight: 'var(--spacing-xs)' }}>
        {status === 'Approved' && '🟢'}
        {status === 'In Progress' && '🔵'}
        {status === 'Pending' && '🟠'}
        {status === 'Rejected' && '🔴'}
        {status === 'Exception' && '🟣'}
      </span>
      {status}
    </span>
  );
};

const Header = ({ view, setView, userRole }) => {
  // STRICT ENGINEERING & ERROR PREVENTION RULE: Scope & Reference
  const getBreadcrumbs = () => {
    const crumbs = [{ label: 'Dashboard', screen: 'DASHBOARD' }];
    if (view.screen === 'VEHICLE_LIST') {
      crumbs.push({ label: 'Vehicles', screen: 'VEHICLE_LIST' });
    } else if (view.screen === 'VEHICLE_DETAIL' && view.params?.id) {
      crumbs.push({ label: 'Vehicles', screen: 'VEHICLE_LIST' });
      crumbs.push({ label: `Vehicle ${view.params.id}`, screen: 'VEHICLE_DETAIL', params: { id: view.params.id } });
    }
    // Add other screens here
    return crumbs;
  };

  const currentCrumbs = getBreadcrumbs();

  return (
    <header className="header">
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
        <a href="#" className="header-logo" onClick={() => setView({ screen: 'DASHBOARD', params: {} })}>
          FleetManager™
        </a>
        {/* UI/UX LAW: Full-Screen Navigation - Clear breadcrumbs */}
        <div className="breadcrumbs">
          {currentCrumbs.map((crumb, index) => (
            <React.Fragment key={crumb.screen + index}>
              <a
                href="#"
                className="breadcrumb-link"
                onClick={() => setView({ screen: crumb.screen, params: crumb.params || {} })}
                style={{
                  color: index === currentCrumbs.length - 1 ? 'var(--text-main)' : 'var(--text-secondary)',
                  fontWeight: index === currentCrumbs.length - 1 ? 'var(--font-weight-semibold)' : 'var(--font-weight-normal)'
                }}
              >
                {crumb.label}
              </a>
              {index < currentCrumbs.length - 1 && (
                <span className="breadcrumb-separator">/</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
      <div className="global-search">
        {/* UI/UX LAW: Floating global search with smart suggestions */}
        <input type="text" placeholder="🔍 Global Search for vehicles, drivers, maintenance..." />
        {/* Smart suggestions would appear here, potentially with glassmorphism */}
      </div>
      <div className="user-menu">
        <button>
          <span>{userRole}</span>
          <div className="user-menu-icon">
            <span className="icon-user"></span>
          </div>
        </button>
      </div>
    </header>
  );
};

const Chart = ({ type, title, data, pulse = false }) => {
  // Placeholder for various chart types
  const ChartIcon = () => {
    switch (type) {
      case 'Bar': return '📊';
      case 'Line': return '📈';
      case 'Donut': return '🍩';
      case 'Gauge': return '🎯';
      default: return '📊';
    }
  };
  return (
    <div className={`chart-container ${pulse ? 'real-time-pulsing' : ''}`}
      style={{
        padding: 'var(--spacing-md)',
        height: '100%',
        minHeight: '250px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
      <h4 style={{
        fontSize: 'var(--font-size-md)',
        fontWeight: 'var(--font-weight-semibold)',
        marginBottom: 'var(--spacing-md)',
        color: 'var(--text-main)'
      }}>{title}</h4>
      <p style={{ color: 'var(--text-placeholder)', fontSize: 'var(--font-size-lg)' }}>
        <ChartIcon /> {type} Chart Placeholder
      </p>
      {/* Actual chart rendering logic would go here, e.g., using Chart.js or D3 */}
      {/* Sample data not directly used for rendering, just for concept */}
      <div style={{
        fontSize: 'var(--font-size-sm)',
        color: 'var(--text-secondary)',
        marginTop: 'var(--spacing-sm)'
      }}>Data points: {data?.length || 0}</div>
    </div>
  );
};

const NewsFeed = ({ activities, title, userRole }) => {
  // RBAC Logic: Filter activities based on userRole if needed (simplified here)
  const filteredActivities = activities?.filter(activity => {
    // Example: Only Admin can see 'System' alerts
    if (activity.user === 'System' && userRole !== ROLES.ADMIN) {
      return false;
    }
    return true;
  }) || [];

  return (
    <div className="recent-activities-panel"
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}>
      <h3 className="sub-section-title"
        style={{
          marginTop: '0',
          marginBottom: 'var(--spacing-md)'
        }}>{title}</h3>
      <div style={{ flexGrow: '1', overflowY: 'auto' }}>
        {filteredActivities.length === 0 ? (
          <p style={{ color: 'var(--text-placeholder)', textAlign: 'center' }}>No recent activities.</p>
        ) : (
          filteredActivities?.map(activity => (
            <div key={activity.id} className="activity-item"
              style={{
                marginBottom: 'var(--spacing-sm)',
                padding: 'var(--spacing-sm) 0',
                borderBottom: '1px solid var(--border-light)'
              }}>
              <p style={{ margin: '0' }}>
                <strong style={{ fontWeight: 'var(--font-weight-semibold)' }}>{activity.user}: </strong>
                {activity.description}
              </p>
              <div className="activity-timestamp">
                {new Date(activity.timestamp).toLocaleString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const MilestoneTracker = ({ workflow }) => {
  const currentStageName = workflow?.currentStage;
  const stages = workflow?.stages || [];

  return (
    <div className="milestone-tracker">
      <h3 className="sub-section-title" style={{ marginTop: '0' }}>Workflow Progress</h3>
      <div className="milestone-steps">
        {stages.map((stage, index) => {
          const isCompleted = stage.status === 'completed';
          const isCurrent = stage.status === 'current';
          const slaStatus = stage.sla;
          return (
            <div
              key={stage.name}
              className={`milestone-step ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''} ${slaStatus === 'breached' ? 'sla-breached' : ''}`}
            >
              <div className="milestone-dot">
                {(isCompleted || isCurrent) && <span style={{ color: 'white', fontSize: '1.2em' }}>✓</span>}
              </div>
              <div className="milestone-label">
                {stage.name}
                {stage.date && <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>{new Date(stage.date).toLocaleDateString()}</div>}
                {slaStatus && (
                  <span className={`milestone-sla ${slaStatus}`}
                    style={{
                      marginTop: 'var(--spacing-xs)',
                      display: 'inline-block'
                    }}>
                    SLA: {slaStatus.toUpperCase()}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};


// Main App Component
function App() {
  const [view, setView] = useState({ screen: 'DASHBOARD', params: {} });
  const [userRole, setUserRole] = useState(ROLES.FLEET_MANAGER); // Default role
  const [vehicles, setVehicles] = useState(SAMPLE_VEHICLES);
  const [drivers, setDrivers] = useState(SAMPLE_DRIVERS);
  const [maintenance, setMaintenance] = useState(SAMPLE_MAINTENANCE);
  const [activities, setActivities] = useState(SAMPLE_ACTIVITIES);

  // Simulate real-time data updates (e.g., for KPI cards or charts)
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate fuel level change
      setVehicles(prevVehicles =>
        prevVehicles.map(v => ({
          ...v,
          fuelLevel: Math.max(0, Math.min(1, v.fuelLevel + (Math.random() - 0.5) * 0.1)), // +/- 10%
        }))
      );
      // Simulate new activity
      if (Math.random() > 0.7) { // 30% chance for a new activity
        const newActivity = {
          id: `ACT${activities.length + 1}`,
          type: 'System Update',
          entity: 'General',
          user: 'System',
          timestamp: new Date().toISOString(),
          description: `System check completed at ${new Date().toLocaleTimeString()}.`,
        };
        // STRICT ENGINEERING & ERROR PREVENTION RULE: State Immutability
        setActivities(prevActivities => [newActivity, ...prevActivities]);
      }
    }, 5000); // Every 5 seconds

    return () => clearInterval(interval);
  }, [activities.length]); // Re-run effect if activities length changes for new ID generation

  // STRICT ENGINEERING & ERROR PREVENTION RULE: Scope & Reference
  const handleCardClick = (screen, params) => {
    // UI/UX LAW: Card-First + Click-Through UX & Full-Screen Navigation
    setView({ screen, params });
  };

  const handleAction = (actionType, id) => {
    alert(`Performing ${actionType} action on item ${id}. (Role: ${userRole})`);
    // Example: Update vehicle status for 'Approve' action
    if (actionType === 'Approve' && userRole === ROLES.ADMIN) {
      setVehicles(prevVehicles =>
        prevVehicles.map(v =>
          v.id === id ? { ...v, status: 'Approved', workflow: { ...v.workflow, currentStage: 'Approved for Use' } } : v
        )
      );
      setActivities(prevActivities => [{
        id: `ACT${prevActivities.length + 1}`,
        type: 'Status Change',
        entity: id,
        user: userRole,
        timestamp: new Date().toISOString(),
        description: `Vehicle ${id} status approved.`,
      }, ...prevActivities]);
    }
  };

  const Dashboard = () => {
    // Derive KPI data
    const totalVehicles = vehicles.length;
    const availableVehicles = vehicles.filter(v => v.status === 'Approved' && v.driverId !== null).length;
    const maintenanceDue = vehicles.filter(v => new Date(v.nextMaintenance) < new Date()).length;
    const avgFuelLevel = (vehicles.reduce((sum, v) => sum + v.fuelLevel, 0) / totalVehicles) * 100;

    return (
      <div className="main-content">
        <h2 className="section-title">Fleet Overview</h2>
        <div className="dashboard-grid"
          style={{
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 'var(--spacing-lg)'
          }}>
          <div className="kpi-card card real-time-pulsing">
            <div className="kpi-card-label">Vehicles Available</div>
            <div className="kpi-card-value">
              {availableVehicles} / {totalVehicles}
              {/* UI/UX LAW: Intelligence - Trend indicators */}
              <span className="kpi-card-trend up">▲ 5%</span>
            </div>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>Ready for deployment</p>
          </div>
          <div className="kpi-card card real-time-pulsing">
            <div className="kpi-card-label">Maintenance Due</div>
            <div className="kpi-card-value">
              {maintenanceDue}
              <span className="kpi-card-trend down">▼ 2%</span>
            </div>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>Upcoming services</p>
          </div>
          <div className="kpi-card card real-time-pulsing">
            <div className="kpi-card-label">Avg Fuel Level</div>
            <div className="kpi-card-value">
              {avgFuelLevel.toFixed(0)}%
              <span className="kpi-card-trend stable">↔︎</span>
            </div>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>Across entire fleet</p>
          </div>
          <div className="kpi-card card real-time-pulsing" onClick={() => handleCardClick('VEHICLE_LIST', {})}>
            <div className="kpi-card-label">Total Vehicles</div>
            <div className="kpi-card-value">{totalVehicles}</div>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>Click to view all vehicles</p>
          </div>
        </div>

        <div className="dashboard-grid"
          style={{
            gridTemplateColumns: '2fr 1fr',
            gap: 'var(--spacing-xl)',
            marginTop: 'var(--spacing-xl)',
            alignItems: 'stretch'
          }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--spacing-md)' }}>
            <Chart type="Bar" title="Fleet Status Overview" data={vehicles} pulse={true} />
            <Chart type="Line" title="Fuel Consumption Trends" data={vehicles} pulse={true} />
          </div>
          <NewsFeed activities={activities} title="Recent Fleet Activities" userRole={userRole} />
        </div>
      </div>
    );
  };

  const VehicleCard = ({ vehicle }) => {
    // STRICT ENGINEERING & ERROR PREVENTION RULE: Null Safety
    const driver = drivers?.find(d => d.id === vehicle.driverId);

    return (
      <div className="card vehicle-card" onClick={() => handleCardClick('VEHICLE_DETAIL', { id: vehicle.id })}>
        <div className="vehicle-card-content">
          <div className="vehicle-card-header">
            <h4 className="vehicle-card-title">{vehicle.make} {vehicle.model} ({vehicle.year})</h4>
            <StatusIndicator status={vehicle.status} />
          </div>
          <div className="vehicle-card-details">
            <p style={{ margin: '0' }}><strong>License Plate:</strong> {vehicle.licensePlate}</p>
            <p style={{ margin: '0' }}><strong>Driver:</strong> {driver?.name || 'Unassigned'}</p>
            <p style={{ margin: '0' }}><strong>Mileage:</strong> {vehicle.mileage?.toLocaleString()} km</p>
            <p style={{ margin: '0' }}><strong>Next Service:</strong> {vehicle.nextMaintenance}</p>
          </div>
        </div>
        {/* UI/UX LAW: Quick actions - hover actions (web) */}
        <div className="vehicle-card-quick-actions">
          {userRole === ROLES.ADMIN && vehicle.status === 'Pending' && (
            <button className="action-button" onClick={(e) => { e.stopPropagation(); handleAction('Approve', vehicle.id); }}>
              <span className="icon-approve" style={{ marginRight: 'var(--spacing-xs)' }}></span>Approve
            </button>
          )}
          {(userRole === ROLES.ADMIN || userRole === ROLES.FLEET_MANAGER) && (
            <button className="action-button" onClick={(e) => { e.stopPropagation(); handleAction('Edit', vehicle.id); }}>
              <span className="icon-edit" style={{ marginRight: 'var(--spacing-xs)' }}></span>Edit
            </button>
          )}
          <button className="action-button" onClick={(e) => { e.stopPropagation(); handleCardClick('VEHICLE_DETAIL', { id: vehicle.id }); }}>
            <span className="icon-view" style={{ marginRight: 'var(--spacing-xs)' }}></span>View
          </button>
        </div>
      </div>
    );
  };

  const VehicleList = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [sortBy, setSortBy] = useState('make'); // 'make', 'status', 'mileage'

    // STRICT ENGINEERING & ERROR PREVENTION RULE: Scope & Reference
    const handleSearch = (e) => setSearchTerm(e.target.value);
    const handleFilterChange = (e) => setFilterStatus(e.target.value);
    const handleSortChange = (e) => setSortBy(e.target.value);

    let filteredVehicles = vehicles?.filter(v =>
      v.make?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.licensePlate?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    if (filterStatus !== 'All') {
      filteredVehicles = filteredVehicles.filter(v => v.status === filterStatus);
    }

    filteredVehicles.sort((a, b) => {
      if (sortBy === 'make') return a.make?.localeCompare(b.make || '');
      if (sortBy === 'status') return a.status?.localeCompare(b.status || '');
      if (sortBy === 'mileage') return (a.mileage || 0) - (b.mileage || 0);
      return 0;
    });

    const hasVehicles = filteredVehicles.length > 0;

    return (
      <div className="main-content">
        <div className="vehicle-list-header">
          <h2 className="section-title" style={{ margin: '0' }}>Fleet Vehicles</h2>
          <div className="vehicle-list-actions">
            <button className="button-primary" onClick={() => alert('Add New Vehicle (Form behavior: file upload, auto-populated, field-level validations, mandatory fields)')}>
              <span className="icon-plus" style={{ marginRight: 'var(--spacing-xs)' }}></span> Add Vehicle
            </button>
            <button className="button-secondary" onClick={() => alert('Export to PDF/Excel')}>
              <span className="icon-export" style={{ marginRight: 'var(--spacing-xs)' }}></span> Export
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-lg)', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Search vehicles..."
            value={searchTerm}
            onChange={handleSearch}
            style={{
              flex: '1', minWidth: '200px',
              padding: 'var(--spacing-sm) var(--spacing-md)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-sm)',
              boxShadow: 'var(--shadow-subtle)'
            }}
          />
          <select value={filterStatus} onChange={handleFilterChange}
            style={{
              padding: 'var(--spacing-sm) var(--spacing-md)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-sm)',
              boxShadow: 'var(--shadow-subtle)',
              backgroundColor: 'var(--bg-card)',
              color: 'var(--text-main)'
            }}>
            <option value="All">All Statuses</option>
            {['Approved', 'In Progress', 'Pending', 'Rejected', 'Exception'].map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          <select value={sortBy} onChange={handleSortChange}
            style={{
              padding: 'var(--spacing-sm) var(--spacing-md)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-sm)',
              boxShadow: 'var(--shadow-subtle)',
              backgroundColor: 'var(--bg-card)',
              color: 'var(--text-main)'
            }}>
            <option value="make">Sort by Make</option>
            <option value="status">Sort by Status</option>
            <option value="mileage">Sort by Mileage</option>
          </select>
          <button className="button-secondary" onClick={() => alert('Saved views: Visually named views with icons')}>Saved Views</button>
          <button className="button-secondary" onClick={() => alert('Bulk Actions: Example - Assign Driver to multiple, Change Status')}>Bulk Actions</button>
        </div>

        {hasVehicles ? (
          <div className="vehicle-list-grid">
            {filteredVehicles.map(vehicle => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        ) : (
          /* UI/UX LAW: Empty grids - Illustrated empty states with call-to-action buttons */
          <div className="empty-state">
            <h3>No Vehicles Found</h3>
            <p>It looks like there are no vehicles matching your criteria. Add a new vehicle to get started!</p>
            <button className="button-primary" onClick={() => alert('Add New Vehicle')}>
              <span className="icon-plus" style={{ marginRight: 'var(--spacing-xs)' }}></span> Add First Vehicle
            </button>
          </div>
        )}
      </div>
    );
  };

  const VehicleDetail = ({ vehicleId }) => {
    // STRICT ENGINEERING & ERROR PREVENTION RULE: Null Safety
    const vehicle = vehicles?.find(v => v.id === vehicleId);
    const assignedDriver = drivers?.find(d => d.id === vehicle?.driverId);

    if (!vehicle) {
      return (
        <div className="main-content">
          <h2 className="section-title">Vehicle Not Found</h2>
          <p>The vehicle with ID {vehicleId} could not be found.</p>
          <button className="button-primary" onClick={() => setView({ screen: 'VEHICLE_LIST', params: {} })}>Back to List</button>
        </div>
      );
    }

    return (
      // UI/UX LAW: Full-Screen Navigation
      <div className="detail-view">
        <div className="detail-header">
          <h2 className="section-title" style={{ margin: '0' }}>{vehicle.make} {vehicle.model} ({vehicle.licensePlate})</h2>
          <div className="detail-actions">
            {userRole === ROLES.ADMIN && vehicle.status === 'Pending' && (
              <button className="button-primary" onClick={() => handleAction('Approve', vehicle.id)}>
                <span className="icon-approve" style={{ marginRight: 'var(--spacing-xs)' }}></span> Approve
              </button>
            )}
            {(userRole === ROLES.ADMIN || userRole === ROLES.FLEET_MANAGER) && (
              <button className="button-secondary" onClick={() => handleAction('Edit', vehicle.id)}>
                <span className="icon-edit" style={{ marginRight: 'var(--spacing-xs)' }}></span> Edit
              </button>
            )}
            <button className="button-secondary" onClick={() => alert('Export Vehicle Data')}>
              <span className="icon-export" style={{ marginRight: 'var(--spacing-xs)' }}></span> Export
            </button>
          </div>
        </div>

        <div className="detail-grid">
          <div>
            {/* UI/UX LAW: Appian Record Alignment - Record Summary Page */}
            <h3 className="sub-section-title" style={{ marginTop: '0' }}>Vehicle Summary</h3>
            <div className="detail-main-info">
              <div className="detail-info-card">
                <strong>Status</strong>
                <StatusIndicator status={vehicle.status} />
              </div>
              <div className="detail-info-card">
                <strong>License Plate</strong>
                <span>{vehicle.licensePlate}</span>
              </div>
              <div className="detail-info-card">
                <strong>Make / Model</strong>
                <span>{vehicle.make} {vehicle.model}</span>
              </div>
              <div className="detail-info-card">
                <strong>Year</strong>
                <span>{vehicle.year}</span>
              </div>
              <div className="detail-info-card">
                <strong>Assigned Driver</strong>
                <span>{assignedDriver?.name || 'Unassigned'}</span>
              </div>
              <div className="detail-info-card">
                <strong>Mileage</strong>
                <span>{vehicle.mileage?.toLocaleString()} km</span>
              </div>
              <div className="detail-info-card">
                <strong>Fuel Level</strong>
                <span>{(vehicle.fuelLevel * 100)?.toFixed(0)}%</span>
              </div>
              <div className="detail-info-card">
                <strong>Next Maintenance</strong>
                <span>{vehicle.nextMaintenance}</span>
              </div>
            </div>

            {/* UI/UX LAW: Appian Record Alignment - Milestone Tracker */}
            <MilestoneTracker workflow={vehicle.workflow} />

            {/* UI/UX LAW: Related records visibility required? true */}
            <div className="related-records-panel">
              <h3 className="sub-section-title" style={{ marginTop: '0' }}>Related Records</h3>
              <div className="related-records-list">
                {vehicle.relatedRecords?.drivers?.length > 0 && (
                  <div className="related-record-item">
                    <span>Drivers:</span>
                    <a href="#" onClick={() => alert('View Driver Details')}>{vehicle.relatedRecords.drivers.map(d => d.name).join(', ')}</a>
                  </div>
                )}
                {vehicle.relatedRecords?.maintenance?.length > 0 && (
                  <div className="related-record-item">
                    <span>Maintenance:</span>
                    <a href="#" onClick={() => alert('View Maintenance History')}>{vehicle.relatedRecords.maintenance.map(m => m.type).join(', ')}</a>
                  </div>
                )}
                {vehicle.relatedRecords?.fuelLogs?.length > 0 && (
                  <div className="related-record-item">
                    <span>Fuel Logs:</span>
                    <a href="#" onClick={() => alert('View Fuel Logs')}>View ({vehicle.relatedRecords.fuelLogs.length})</a>
                  </div>
                )}
                {vehicle.documents?.length > 0 && (
                  <div className="related-record-item">
                    <span>Documents:</span>
                    {/* UI/UX LAW: Document preview required? true */}
                    <a href={vehicle.documents[0].url} target="_blank" rel="noopener noreferrer" onClick={(e) => alert(`Previewing ${vehicle.documents[0].name}`)}>
                      {vehicle.documents[0].name} (Preview)
                    </a>
                  </div>
                )}
                {!vehicle.relatedRecords?.drivers?.length &&
                  !vehicle.relatedRecords?.maintenance?.length &&
                  !vehicle.relatedRecords?.fuelLogs?.length &&
                  !vehicle.documents?.length && (
                    <p style={{ color: 'var(--text-secondary)' }}>No related records or documents.</p>
                  )}
              </div>
            </div>
          </div>

          {/* UI/UX LAW: Appian Record Alignment - News/Audit Feed */}
          <NewsFeed
            activities={activities.filter(a => a.entity === vehicle.id || a.entity === 'General')}
            title="Vehicle Activity Log"
            userRole={userRole}
          />
        </div>
      </div>
    );
  };

  const renderScreen = () => {
    switch (view.screen) {
      case 'DASHBOARD':
        return <Dashboard />;
      case 'VEHICLE_LIST':
        return <VehicleList />;
      case 'VEHICLE_DETAIL':
        return <VehicleDetail vehicleId={view.params?.id} />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app">
      <Header view={view} setView={setView} userRole={userRole} />
      {renderScreen()}
    </div>
  );
}

// STRICT ENGINEERING & ERROR PREVENTION RULE: Export Pattern
export default App;