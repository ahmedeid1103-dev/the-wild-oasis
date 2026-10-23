import type { Metadata } from "next";
import { Suspense } from "react";

import ProfileForm from "@/features/profile/components/ProfileForm";
import { getAccountGuest } from "@/features/profile/queries";

export const metadata: Metadata = {
  title: "Profile",
};

export default function Page() {
  return (
    <Suspense fallback={<p aria-busy="true">Loading your profile...</p>}>
      <ProfilePageContent />
    </Suspense>
  );
}

async function ProfilePageContent() {
  const { guest } = await getAccountGuest();

  return (
    <div>
      <h1 className="mb-3 text-4xl font-medium text-accent-400">
        Guest profile
      </h1>

      {!guest ? (
        <>
          <p className="mb-8 max-w-2xl text-lg leading-8 text-primary-200">
            Create a profile for your account. Existing guest records are not
            linked automatically.
          </p>
          <ProfileForm />
        </>
      ) : (
        <>
          <p className="mb-8 max-w-2xl text-lg leading-8 text-primary-200">
            Review or update the details saved to your guest profile.
          </p>

          <ProfileForm
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
