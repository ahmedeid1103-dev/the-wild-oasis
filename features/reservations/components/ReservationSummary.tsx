type ReservationSummaryProps = {
  reservations: {
    numNights: number;
    totalPrice: number;
  }[];
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export default function ReservationSummary({
  reservations,
}: ReservationSummaryProps) {
  const summary = reservations.reduce(
    (totals, reservation) => ({
      nights: totals.nights + reservation.numNights,
      totalValue: totals.totalValue + reservation.totalPrice,
    }),
    { nights: 0, totalValue: 0 },
  );

  const metrics = [
    { label: "Reservations", value: reservations.length },
    { label: "Nights booked", value: summary.nights },
    { label: "Total value", value: currencyFormatter.format(summary.totalValue) },
  ];

  return (
    <section
      aria-label="Reservation summary"
      className="ui-card ui-card--raised mb-8 grid overflow-hidden divide-y divide-primary-800 shadow-none sm:grid-cols-3 sm:divide-x sm:divide-y-0"
    >
      {metrics.map((metric) => (
        <article key={metric.label} className="p-5">
          <p className="mb-2 text-sm text-primary-400">{metric.label}</p>
          <p className="text-2xl font-medium text-primary-100">
            {metric.value}
          </p>
        </article>
      ))}
    </section>
  );
}
