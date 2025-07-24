import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  TriangleAlertIcon,
  TrendingUpIcon,
  ChartColumnIcon,
} from "../../components/ui/icons";
import {
  fetchOverdueBooks,
  fetchPopularGenres,
  fetchAnalyticsSummary,
} from "../../redux/borrowRecords/borrowRecordsSlice";

const AdminReportsPage = () => {
  const dispatch = useDispatch();
  const { overdueBooks, popularGenres, analyticsSummary, loading, error } =
    useSelector((state) => state.borrowRecords);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      dispatch(fetchOverdueBooks());
      dispatch(fetchPopularGenres());
      dispatch(fetchAnalyticsSummary());
    }
  }, [dispatch, token]);

  // Format stats from analytics summary
  const stats = [
    {
      title: "Total Borrows This Month",
      value: analyticsSummary?.totalBorrows || 0,
      change: "+12% from last month", // You might want to calculate this from your API
    },
    {
      title: "Average Borrow Duration",
      value: analyticsSummary?.avgDuration
        ? `${analyticsSummary.avgDuration.toFixed(1)} days`
        : "0 days",
      change: "-2 days from last month", // You might want to calculate this from your API
    },
    {
      title: "Return Rate",
      value: analyticsSummary?.returnRate
        ? `${(analyticsSummary.returnRate * 100).toFixed(1)}%`
        : "0%",
      change: "+1.2% from last month", // You might want to calculate this from your API
    },
  ];

  // Format overdue books for display
  const formattedOverdueBooks =
    overdueBooks?.map((book) => ({
      title: book.bookTitle,
      member: book.memberName,
      due: new Date(book.dueDate).toLocaleDateString(),
      overdue: `${book.daysOverdue} day${
        book.daysOverdue !== 1 ? "s" : ""
      } overdue`,
    })) || [];

  // Format popular genres for display
  const formattedGenres =
    popularGenres?.map((genre) => ({
      name: genre.name,
      count: genre.borrowCount,
    })) || [];

  return (
    <main className="flex-1 overflow-auto p-6">
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600">Library analytics and reports</p>
        </div>

        {/* Top Section: Overdue + Genres */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Overdue Books */}
          <div className="rounded-lg border border-primary/10 bg-white text-card-foreground shadow-sm">
            <div className="flex flex-col space-y-1.5 p-6">
              <div className="text-2xl font-semibold tracking-tight flex items-center">
                <TriangleAlertIcon className="h-5 w-5 text-red-500 mr-2" />
                Overdue Books
              </div>
              <div className="text-sm text-muted-foreground">
                Books that are past their due date
              </div>
            </div>
            <div className="p-6 pt-0 space-y-4">
              {loading ? (
                <div className="text-center py-4">Loading overdue books...</div>
              ) : formattedOverdueBooks.length > 0 ? (
                formattedOverdueBooks.map((book, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-3 bg-red-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{book.title}</p>
                      <p className="text-sm text-gray-600">
                        Member: {book.member}
                      </p>
                      <p className="text-sm text-gray-600">Due: {book.due}</p>
                    </div>
                    <div className="inline-flex items-center rounded-full bg-destructive text-destructive-foreground px-2.5 py-0.5 text-xs font-semibold">
                      {book.overdue}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">
                  No overdue books found
                </div>
              )}
            </div>
          </div>

          {/* Popular Genres */}
          <div className="rounded-lg border border-primary/10 bg-white text-card-foreground shadow-sm">
            <div className="flex flex-col space-y-1.5 p-6">
              <div className="text-2xl font-semibold tracking-tight flex items-center">
                <TrendingUpIcon className="h-5 w-5 text-green-500 mr-2" />
                Popular Genres
              </div>
              <div className="text-sm text-muted-foreground">
                Most borrowed book genres
              </div>
            </div>
            <div className="p-6 pt-0 space-y-4">
              {loading ? (
                <div className="text-center py-4">
                  Loading popular genres...
                </div>
              ) : formattedGenres.length > 0 ? (
                formattedGenres.map((genre, index) => (
                  <div
                    key={genre.name}
                    className="flex justify-between items-center"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-gray-500">
                        #{index + 1}
                      </span>
                      <span className="font-medium">{genre.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 h-2 bg-gray-200 rounded-full">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{
                            width: `${
                              (genre.count / (formattedGenres[0]?.count || 1)) *
                              100
                            }%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">
                        {genre.count}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">
                  No genre data available
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Section: Key Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="rounded-lg border border-primary/10 bg-white text-card-foreground shadow-sm"
            >
              <div className="p-6 flex justify-between items-center pb-2">
                <div className="tracking-tight text-sm font-medium">
                  {stat.title}
                </div>
                <ChartColumnIcon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="p-6 pt-0">
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.change}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default AdminReportsPage;
