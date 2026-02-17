import { useState, useEffect } from 'react'
import { getDeliveryZones } from '../services/api'

export default function DeliveryZoneSelector({ selectedZone, onChange }) {
  const [zones, setZones] = useState([])

  useEffect(() => {
    const fetchZones = async () => {
      const data = await getDeliveryZones()
      setZones(data)
    }
    fetchZones()
  }, [])

  return (
    <select
      value={selectedZone}
      onChange={(e) => onChange(Number(e.target.value))}
      className="border p-2 rounded w-full"
    >
      <option value="">Select delivery zone</option>
      {zones.map(zone => (
        <option key={zone.id} value={zone.id}>
          {zone.name} - KSh {zone.price}
        </option>
      ))}
    </select>
  )
}