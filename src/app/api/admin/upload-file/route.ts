import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('adminToken');
    if (!token || token.value !== 'authenticated') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Clean file name to avoid issues
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `admin_upload_${Date.now()}_${safeName}`;
    const filePath = join(process.cwd(), 'public', 'uploads', fileName);
    
    await writeFile(filePath, buffer);
    const fileUrl = `/uploads/${fileName}`;

    return NextResponse.json({ success: true, url: fileUrl });
  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
