import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/Header";
import { Settings, Plus, Edit, Trash2, Loader2 } from "lucide-react";
import { SERVICE_CATEGORIES, TARGET_AUDIENCES, Service, Organization } from "@/lib/mockData";
import { getServices, createService, updateService, deleteService, getOrganizations } from "@/lib/organizationDb";
import { toast } from "@/hooks/use-toast";

export default function ServiceManagement() {
  const [services, setServices] = useState<Service[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    organization_id: "",
    name: "",
    description: "",
    category: "",
    price: "",
    duration: "",
    features: "",
    target_audience: ""
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [servicesData, orgsData] = await Promise.all([
        getServices(),
        getOrganizations()
      ]);
      setServices(servicesData);
      setOrganizations(orgsData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const featuresArray = formData.features.split(',').map(f => f.trim()).filter(f => f);
      const serviceData = {
        organization_id: formData.organization_id,
        name: formData.name,
        description: formData.description,
        category: formData.category,
        price: formData.price ? Number(formData.price) : undefined,
        duration: formData.duration || undefined,
        features: featuresArray,
        target_audience: formData.target_audience
      };
      
      if (editingService) {
        const updated = await updateService(editingService.id, serviceData);
        setServices(services => services.map(service => 
          service.id === editingService.id ? updated : service
        ));
        toast({
          title: "Success",
          description: "Service updated successfully"
        });
      } else {
        const newService = await createService(serviceData);
        setServices(services => [newService, ...services]);
        toast({
          title: "Success",
          description: "Service created successfully"
        });
      }
      
      setIsDialogOpen(false);
      setEditingService(null);
      setFormData({
        organization_id: "",
        name: "",
        description: "",
        category: "",
        price: "",
        duration: "",
        features: "",
        target_audience: ""
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save service",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      organization_id: service.organization_id,
      name: service.name,
      description: service.description,
      category: service.category,
      price: service.price?.toString() || "",
      duration: service.duration || "",
      features: service.features.join(', '),
      target_audience: service.target_audience
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteService(id);
      setServices(services => services.filter(service => service.id !== id));
      toast({
        title: "Success",
        description: "Service deleted successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete service",
        variant: "destructive"
      });
    }
  };

  const getOrganizationName = (orgId: string) => {
    return organizations.find(org => org.id === orgId)?.name || "Unknown";
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Settings className="h-8 w-8" />
จัดการข้อมูลบริการ
          </h1>
          <p className="text-muted-foreground mt-2">
จัดการข้อมูลบริการและรายละเอียด
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingService(null);
              setFormData({
                organization_id: "",
                name: "",
                description: "",
                category: "",
                price: "",
                duration: "",
                features: "",
                target_audience: ""
              });
            }}>
              <Plus className="h-4 w-4 mr-2" />
เพิ่มบริการ
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingService ? "แก้ไขบริการ" : "เพิ่มบริการใหม่"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="organization_id">องค์กร</Label>
                <Select value={formData.organization_id} onValueChange={(value) => setFormData(prev => ({ ...prev, organization_id: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกองค์กร" />
                  </SelectTrigger>
                  <SelectContent>
                    {organizations.map(org => (
                      <SelectItem key={org.id} value={org.id}>{org.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="name">ชื่อบริการ</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">คำอธิบาย</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="category">หมวดหมู่</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกหมวดหมู่" />
                  </SelectTrigger>
                  <SelectContent>
                    {SERVICE_CATEGORIES.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="price">ราคา (฿)</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="ไม่บังคับ"
                />
              </div>
              <div>
                <Label htmlFor="duration">ระยะเวลา</Label>
                <Input
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                  placeholder="เช่น 2 ชั่วโมง, ต่อคน, รายเดือน"
                />
              </div>
              <div>
                <Label htmlFor="features">คุณสมบัติ (คั่นด้วยจุลภาค)</Label>
                <Textarea
                  id="features"
                  value={formData.features}
                  onChange={(e) => setFormData(prev => ({ ...prev, features: e.target.value }))}
                  placeholder="คุณสมบัติ 1, คุณสมบัติ 2, คุณสมบัติ 3"
                />
              </div>
              <div>
                <Label htmlFor="target_audience">กลุ่มเป้าหมาย</Label>
                <Select value={formData.target_audience} onValueChange={(value) => setFormData(prev => ({ ...prev, target_audience: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกกลุ่มเป้าหมาย" />
                  </SelectTrigger>
                  <SelectContent>
                    {TARGET_AUDIENCES.map(audience => (
                      <SelectItem key={audience} value={audience}>{audience}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {editingService ? "อัปเดต" : "สร้าง"}บริการ
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
          <Card key={service.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{service.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {getOrganizationName(service.organization_id)}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="secondary">{service.category}</Badge>
                    {service.price && (
                      <Badge variant="outline">฿{service.price.toLocaleString()}</Badge>
                    )}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(service)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(service.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                {service.description}
              </p>
              <div className="mb-3">
                <p className="text-sm font-medium mb-1">กลุ่มเป้าหมาย: {service.target_audience}</p>
                {service.duration && (
                  <p className="text-sm text-muted-foreground">ระยะเวลา: {service.duration}</p>
                )}
              </div>
              {service.features.length > 0 && (
                <div className="mb-3">
                  <p className="text-sm font-medium mb-1">คุณสมบัติ:</p>
                  <div className="flex flex-wrap gap-1">
                    {service.features.slice(0, 3).map((feature, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                    {service.features.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{service.features.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                สร้างเมื่อ: {new Date(service.created_at).toLocaleDateString('th-TH')}
              </p>
            </CardContent>
          </Card>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}