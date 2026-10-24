import type { Metadata } from "next";

import ProfileForm from "@/features/profile/components/ProfileForm";
import { getAccountGuest } from "@/features/profile/queries";

export const metadata: Metadata = {
  title: "Profile",
};

export default function Page() {
  return <ProfilePageContent />;
}

async function ProfilePageContent() {
  const { guest } = await getAccountGuest();

  return (
    <div>
      <h1 className="ui-page-title mb-3">
        Guest profile
      </h1>

      {!guest ? (
        <>
          <p className="mb-8 max-w-2xl text-lg leading-8 text-primary-200">
            Create a profile for your account. Existing guest records are not
            linked automatically.
          </p>
          <ProfileForm key="new-profile" />
        </>
      ) : (
        <>
          <p className="mb-8 max-w-2xl text-lg leading-8 text-primary-200">
            Your guest details are saved below. You can update them whenever
            needed.
          </p>

          <ProfileForm
            key={guest.id}
            email={guest.email}
            profile={{
              fullName: guest.fullName,
              nationality: guest.nationality,
              nationalID: guest.nationalID,
              countryFlag: guest.countryFlag,
            }}
          />
        </>
      )}
    </div>
  );
}
