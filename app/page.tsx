"use client";

import { useEffect, useRef, useState } from "react";
import { fromLonLat } from "ol/proj";
import { QrScanner } from "@yudiel/react-qr-scanner";
import Point from "ol/geom/Point.js";
import useGeolocation from "./hooks/useGeolocation";
import Map from "./components/map/Map";
import { proximityCheck } from "./components/map/proximityCheck";
import { mockVehicle } from "./vehicle";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const router = useRouter();

  const [geoPosition] = useGeolocation();
  const [notification, setNotification] = useState<string | null>();
  const [vehicleList, setVehicleList] = useState<any>([]);
  const [showScanner, setShowScanner] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [vehicle, setVehicle] = useState<any>(mockVehicle);

  useEffect(() => {
    if (geoPosition?.coords) {
      const distance = proximityCheck(
        new Point(
          fromLonLat([
            geoPosition.coords.longitude,
            geoPosition.coords.latitude,
          ])
        ),
        new Point(
          fromLonLat([vehicle.position.longitude, vehicle.position.latitude])
        )
      );

      if (distance < 1000) {
        dialogRef.current?.showModal();
        setNotification("A wild vehicle appeared!");
        setVehicleList([vehicle]);
      } else {
        setNotification(null);
        setVehicleList([]);
      }
    }
  }, [
    geoPosition?.coords.latitude,
    geoPosition?.coords.longitude,
    vehicle.position.longitude,
    vehicle.position.latitude,
    geoPosition?.coords,
    vehicle,
  ]);

  useEffect(() => {
    console.log(scanResult);
    if (scanResult !== undefined && scanResult !== null) {
      router.push(`/vehicle?id=${scanResult}`);
    }
  }, [scanResult, router]);

  const fakeVehicleProximity = () => {
    if (geoPosition?.coords.latitude) {
      const updatedVehicle = {
        ...vehicle,
        position: {
          latitude: geoPosition?.coords.latitude + 0.001,
          ...vehicle.position,
        },
      };
      setVehicle(updatedVehicle);
    }
  };

  return (
    <main>
      <div className="container mx-auto box-border px-4">
        <p>
          lat: {geoPosition?.coords.latitude} lon:{" "}
          {geoPosition?.coords.longitude}
        </p>
        <h1>Location-based Features</h1>
        <h4>Notifications/Content</h4>
        <h4 onClick={() => fakeVehicleProximity()}>Vehicle List</h4>
        <p>
          Vehicles nearby:{" "}
          {vehicleList?.map((vehicle: any) => (
            <span
              className="font-bold text-green-500"
              key={vehicle.displayName}
            >
              {vehicle.displayName}
            </span>
          ))}
        </p>
      </div>
      <div className="h-[500px] w-full mt-24 mb-4">
        <Map vehicles={[vehicle]} />
      </div>
      <div className="container mx-auto box-border px-4">
        {vehicleList.length > 0 && (
          <button
            className="bg-blue-500 py-5 font-bold text-lg border-none shadow-sm text-blue-50 w-full"
            onClick={() => setShowScanner(!showScanner)}
          >
            {showScanner ? "DONE" : "SCAN VEHICLE"}
          </button>
        )}
      </div>
      <dialog className="w-80" ref={dialogRef} open={!!notification}>
        <Image
          priority
          width="320"
          height="200"
          alt="dialog truck image"
          src="https://media.tenor.com/Xa_U1xQ2aKEAAAAd/truck-drift.gif"
        ></Image>
        <h3>A wild vehicle appeared!</h3>
        <p className="text-xl">{vehicle.displayName} wants to talk to you.</p>
        <button
          className="text-lg bg-blue-500 hover:bg-blue-600 active:bg-blue-700 border-none text-blue-50 px-4 py-2"
          onClick={() => dialogRef.current?.close()}
        >
          OK! Relax..
        </button>
      </dialog>
      {showScanner && (
        <QrScanner
          containerStyle={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100vw",
          }}
          onDecode={(result: any) => setScanResult(result)}
          onResult={(result: any) => setScanResult(result)}
          onError={(error: any) => console.log(error?.message)}
        />
      )}
    </main>
  );
}
