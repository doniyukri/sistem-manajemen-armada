# Fleet board

A read-only view of the transit vehicles that are reporting a live position, built as the TransJakarta frontend technical test. The vehicles, routes, and trips are MBTA’s (Boston), because that is the API the brief specifies.

## Language

**Fleet board**:
The product named Sistem Manajemen Armada in the brief: the set of vehicles reporting a position right now.
_Avoid_: dashboard, fleet manager

**Vehicle**:
A transit vehicle currently reporting where it is. The brief calls this kendaraan.
_Avoid_: bus, train, unit, armada item

**Route**:
A named service a vehicle runs on, such as the Red Line or bus 1.
_Avoid_: line, corridor

**Trip**:
One scheduled run of a vehicle along a route, from one end toward the other.
_Avoid_: journey, schedule

**Stop**:
A place where passengers board or alight. A vehicle points at the stop it is stopped at or heading toward.
_Avoid_: station

**Vehicle status**:
How the vehicle currently relates to its stop. The API values are `IN_TRANSIT_TO`, `STOPPED_AT`, and `INCOMING_AT`.
_Avoid_: state, phase
