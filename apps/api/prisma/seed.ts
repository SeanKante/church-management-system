import { AttendanceStatus, GroupType, PrismaClient, Role } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const password = await bcrypt.hash("Password123", 10);

  const accounts: Array<{ email: string; firstName: string; lastName: string; role: Role }> = [
    { email: "admin@church.org", firstName: "Grace", lastName: "Admin", role: Role.ADMIN },
    { email: "pastor@church.org", firstName: "Daniel", lastName: "Shepherd", role: Role.PASTOR },
    { email: "leader@church.org", firstName: "Mary", lastName: "Leader", role: Role.LEADER },
    { email: "member@church.org", firstName: "John", lastName: "Member", role: Role.MEMBER },
  ];

  for (const account of accounts) {
    await prisma.user.upsert({
      where: { email: account.email },
      update: { firstName: account.firstName, lastName: account.lastName, role: account.role, password },
      create: { ...account, password },
    });
  }

  // Groups (departments, ministries, small groups)
  const groupSeed: Array<{ name: string; type: GroupType }> = [
    { name: "Choir", type: GroupType.DEPARTMENT },
    { name: "Ushers", type: GroupType.DEPARTMENT },
    { name: "Media", type: GroupType.DEPARTMENT },
    { name: "Youth Ministry", type: GroupType.MINISTRY },
    { name: "Women's Ministry", type: GroupType.MINISTRY },
    { name: "Men's Ministry", type: GroupType.MINISTRY },
    { name: "Downtown Cell", type: GroupType.SMALL_GROUP },
    { name: "Eastside Cell", type: GroupType.SMALL_GROUP },
  ];

  const groups = [];
  for (const g of groupSeed) {
    const existing = await prisma.group.findFirst({ where: { name: g.name } });
    const group = existing
      ? await prisma.group.update({ where: { id: existing.id }, data: { type: g.type } })
      : await prisma.group.create({ data: g });
    groups.push(group);
  }

  // Members
  const firstNames = ["Peter", "Esther", "Samuel", "Ruth", "David", "Sarah", "Joseph", "Hannah", "Caleb", "Naomi", "Isaac", "Rebecca"];
  const lastNames = ["Mwangi", "Okello", "Nakato", "Ssentongo", "Achieng", "Mutesi", "Kato", "Auma", "Wanjiru", "Otim"];

  const existingMembers = await prisma.member.count();
  if (existingMembers < 30) {
    for (let i = 0; i < 30; i++) {
      const firstName = firstNames[i % firstNames.length];
      const lastName = lastNames[i % lastNames.length];
      await prisma.member.create({
        data: {
          firstName,
          lastName,
          email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`,
          phone: `+25670000${(1000 + i).toString()}`,
          gender: i % 2 === 0 ? "Male" : "Female",
          groupLinks: {
            create: [{ groupId: groups[i % groups.length].id }],
          },
        },
      });
    }
  }

  // Events
  const now = new Date();
  const eventSeed = [
    { title: "Sunday Service", offsetDays: 3, location: "Main Auditorium" },
    { title: "Midweek Prayer", offsetDays: 6, location: "Prayer Hall" },
    { title: "Youth Conference", offsetDays: 14, location: "Youth Center" },
    { title: "Last Sunday Service", offsetDays: -4, location: "Main Auditorium" },
  ];
  const events = [];
  for (const e of eventSeed) {
    const existing = await prisma.event.findFirst({ where: { title: e.title } });
    const startsAt = new Date(now.getTime() + e.offsetDays * 24 * 60 * 60 * 1000);
    const event = existing
      ? existing
      : await prisma.event.create({ data: { title: e.title, location: e.location, startsAt } });
    events.push(event);
  }

  // Attendance for the past event
  const pastEvent = events.find((e) => e.title === "Last Sunday Service");
  if (pastEvent) {
    const members = await prisma.member.findMany({ take: 20 });
    for (let i = 0; i < members.length; i++) {
      await prisma.attendance.upsert({
        where: { eventId_memberId: { eventId: pastEvent.id, memberId: members[i].id } },
        update: {},
        create: {
          eventId: pastEvent.id,
          memberId: members[i].id,
          status: i % 4 === 0 ? AttendanceStatus.ABSENT : AttendanceStatus.PRESENT,
        },
      });
    }
  }

  // Activity feed
  const activityCount = await prisma.activityLog.count();
  if (activityCount === 0) {
    await prisma.activityLog.createMany({
      data: [
        { type: "member", message: "12 new members added this week" },
        { type: "event", message: "Sunday Service scheduled in the main auditorium" },
        { type: "attendance", message: "Attendance recorded for Last Sunday Service" },
        { type: "group", message: "Youth Ministry reached 25 members" },
      ],
    });
  }

  // eslint-disable-next-line no-console
  console.log("Seed complete. Demo logins (password: Password123):");
  // eslint-disable-next-line no-console
  console.log(accounts.map((a) => `  ${a.role.padEnd(7)} ${a.email}`).join("\n"));
}

main()
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
